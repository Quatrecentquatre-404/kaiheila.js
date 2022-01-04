import UserManager from './User';
import UserChatManager from './UserChat';
import DirectMessageManager from './DirectMessage';
import AssetManager from './Asset';
import RoleManager from './Role';
import GuildManager from './Guild';
import ChannelManager from './Channel';
import MessageManager from './Message';
import IntimacyManager from './Intimacy';
import CardManager from './Card';
import VoiceManager from './Voice';
export { UserManager, UserChatManager, DirectMessageManager, AssetManager, RoleManager, GuildManager, ChannelManager, MessageManager, IntimacyManager, CardManager, VoiceManager };
export declare type BitFields = 'ADMINISTRATOR' | 'MANAGE_SERVER' | 'VIEW_MANAGEMENT_LOG' | 'CREATE_SERVER_INVITATION' | 'MANAGE_INVITATION' | 'MANAGE_CHANNEL' | 'KICKOUT_USERS' | 'BAN_USERS' | 'MANAGE_CUSTOM_EMOTICONS' | 'MODIFY_SERVER_NAME' | 'MANAGE_ROLE_PERMISSIONS' | 'VIEW_TEXT_AND_VOICE_CHANNELS' | 'RELEASE_THE_NEWS' | 'MANAGE_MESSAGE' | 'UPLOAD_FILES' | 'VOICE_LINK' | 'MANAGE_VOICE' | 'MENTION_EVERYONE' | 'ADD_REACTION' | 'FOLLOW_ADDED_REACTION' | 'JOIN_VOICE_AS_MUTED' | 'USE_PUSH_TO_TALK' | 'USE_BUTTON_TO_TALK' | 'SPEAK' | 'MUTE_SERVER' | 'CLOSE_SERVER_MICROPHONE' | 'MANAGE_NICKNAMES' | 'PLAY_ACCOMPANIMENT';
export declare const Bits: {
    ADMINISTRATOR: number;
    MANAGE_SERVER: number;
    VIEW_MANAGEMENT_LOG: number;
    CREATE_SERVER_INVITATION: number;
    MANAGE_INVITATION: number;
    MANAGE_CHANNEL: number;
    KICKOUT_USERS: number;
    BAN_USERS: number;
    MANAGE_CUSTOM_EMOTICONS: number;
    MODIFY_SERVER_NAME: number;
    MANAGE_ROLE_PERMISSIONS: number;
    VIEW_TEXT_AND_VOICE_CHANNELS: number;
    RELEASE_THE_NEWS: number;
    MANAGE_MESSAGE: number;
    UPLOAD_FILES: number;
    VOICE_LINK: number;
    MANAGE_VOICE: number;
    MENTION_EVERYONE: number;
    ADD_REACTION: number;
    FOLLOW_ADDED_REACTION: number;
    JOIN_VOICE_AS_MUTED: number;
    USE_PUSH_TO_TALK: number;
    USE_BUTTON_TO_TALK: number;
    SPEAK: number;
    MUTE_SERVER: number;
    CLOSE_SERVER_MICROPHONE: number;
    MANAGE_NICKNAMES: number;
    PLAY_ACCOMPANIMENT: number;
};
