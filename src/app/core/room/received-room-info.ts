import { ReceivedRoomMedia } from "./received-room-media";

export namespace ReceivedRoomInfo {
    export interface Member {
        id: string;
        displayName: string;
        avatarURL?: any;
    }

    export interface ChatMessage {
        id: string;
        authorMemberId: string;
        date: Date;
        content: string;
        isFromFirstLoad?: boolean;
    }

    export interface Data {
        me: Member;
        roomName: string;
        offlineMembers: Member[];
        onlineMembers: Member[];
        chatMessages: ChatMessage[];
        media: ReceivedRoomMedia[];
    }
}
