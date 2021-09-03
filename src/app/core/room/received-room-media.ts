export interface ReceivedRoomMedia {
    id: string;
    roomId: string;
    authorMemberId: string;
    authorDisplayName: string;
    readableLength: string;
    hash: string;
    type: string;
    date: string,
    data?: string;
    canAutoPlay?: boolean;
}