"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Client = void 0;
const events_1 = require("events");
const API_1 = __importDefault(require("./handlers/API"));
const Websocket_1 = __importDefault(require("./handlers/Websocket"));
const Websocket_2 = require("./typings/handlers/Websocket");
const Manager = __importStar(require("./handlers/managers/index"));
const Card_1 = __importDefault(require("./handlers/managers/Card"));
exports.Card = Card_1.default;
class Client extends events_1.EventEmitter {
    token;
    options;
    sessionId;
    #socket;
    #API;
    managers;
    constructor(token, options = {
        packetCompression: true,
        tokenType: 'BOT',
        lang: 'en-us',
    }) {
        super();
        if (!token)
            throw new Error('You must supply a valid token. You may get a new token through the Kaiheila Developers page : https://developer.kaiheila.cn/app/index');
        this.token = token;
        this.options = options;
        this.#API = new API_1.default(token, this.options);
        this.#socket = undefined;
        this.managers = {
            user: new Manager.UserManager(this),
            userChat: new Manager.UserChatManager(this),
            directMessage: new Manager.DirectMessageManager(this),
            asset: new Manager.AssetManager(this),
            role: new Manager.RoleManager(this),
            guild: new Manager.GuildManager(this),
            channel: new Manager.ChannelManager(this),
            intimacy: new Manager.IntimacyManager(this),
            message: new Manager.MessageManager(this),
            voice: new Manager.VoiceManager(this),
        };
        this.sessionId = '';
    }
    async login() {
        if (this.#socket) {
            clearTimeout(this.#socket.interval);
            this.#socket.reopenSession = true;
        }
        const response = await this.getWebsocketURL(), { code, data } = response.data;
        if (code !== 0)
            throw new Error(`An error occured while trying to ${this.#socket?.sessionId ? 'resume' : 'get'} a Websocket session.`);
        if (this.#socket === undefined) {
            this.#socket = new Websocket_1.default(data.url);
        }
        const onOpen = function () {
            if (!this.#socket)
                return;
            this.#socket.sendHeartBeat();
        }.bind(this), onMessage = function (event) {
            if (!this.#socket)
                return;
            const response = this.#socket.parseResponse(event);
            this.emit('debug', response);
            switch (response.s) {
                case Websocket_2.EventType.MESSAGE:
                    if (response.sn && response.sn > this.#socket.sn) {
                        this.#socket.sn = response.sn;
                    }
                    const message = response.d;
                    let type = message.extra?.type?.toString();
                    type = type === '1' ? 'message' : type;
                    if (!type)
                        return;
                    type.match(/_[a-z]{1}/g)?.forEach(function (value) {
                        type = type.replace(value, value.slice(1).toUpperCase());
                    });
                    this.emit(type, message);
                    break;
                case Websocket_2.EventType.HANDSHAKE:
                    const { sessionId, session_id } = response.d, trustedSessionId = sessionId || session_id;
                    if (!this.#socket.sessionId)
                        this.#socket.sessionId = trustedSessionId;
                    this.sessionId = trustedSessionId;
                    this.emit('ready', trustedSessionId);
                    break;
                case Websocket_2.EventType.PING:
                    this.#socket.sendHeartBeat();
                    break;
                case Websocket_2.EventType.PONG:
                    clearTimeout(this.#socket.interval);
                    this.#socket.interval = setTimeout(() => this.#socket?.sendHeartBeat(), (function () {
                        return Math.floor(Math.random() * (35000 - 25000) + 25000);
                    })());
                    break;
                case Websocket_2.EventType.RESUME_SESSION:
                    this.#socket.send({
                        s: Websocket_2.EventType.RESUME_SESSION,
                        sn: this.#socket.sn,
                    });
                    break;
                case Websocket_2.EventType.RECONNECT:
                    this.#socket.sn = 0;
                    this.#socket.reopenSession = true;
                    this.#socket.socket.close();
                    break;
                case Websocket_2.EventType.ACK:
                    break;
                default:
                    break;
            }
        }.bind(this), onClose = function () {
            if (this.#socket?.interval)
                clearTimeout(this.#socket.interval);
            if (this.#socket?.reopenSession)
                return this.login();
            else
                return this.destroy();
        }.bind(this);
        this.#socket.socket.on('open', onOpen);
        this.#socket.socket.on('message', onMessage);
        this.#socket.socket.on('close', onClose);
    }
    destroy() {
        if (this.#socket?.reopenSession)
            this.#socket.reopenSession = false;
        this.#socket?.socket.close();
        this.emit('disconnected');
    }
    async getWebsocketURL() {
        let params = { compress: this.options.packetCompression ? 1 : 0 };
        if (this.#socket) {
            const { sessionId, sn } = this.#socket;
            if (sessionId !== '' && sn > -1) {
                params = { ...params, resume: '1', sessionId, sn };
            }
        }
        return await this.#API.execute(this.#API.routes.gateway, {
            params,
        });
    }
}
exports.Client = Client;
exports.default = Client;
