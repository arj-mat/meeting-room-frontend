export interface RoomMember {
    id: string;
    displayName: string;
    avatarURL?: string;
    isAdmin: boolean;
    isInRoom: boolean;
}

export interface RoomChatMessage {
    id: string;
    authorMemberId: string;
    date: Date;
    content: string;
}