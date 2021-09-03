import { ReceivedRoomInfo } from "./received-room-info";
import { ReceivedRoomMedia } from "./received-room-media";
import { RoomChatMessage, RoomMember } from "./room-info";

export default class Room {
    id: string;
    name: string;
    memberList: RoomMember[];
    chatMessages: RoomChatMessage[];
    media: ReceivedRoomMedia[];

    constructor( info: ReceivedRoomInfo.Data, roomId: string ) {
        this.id = roomId;
        this.name = info.roomName;
        this.memberList = [
            ...info.onlineMembers.map( i => this.memberInfoToRoomMember( i, true ) ),
            ...info.offlineMembers.map( i => this.memberInfoToRoomMember( i, false ) )
        ];
        this.media = info.media;

        this.chatMessages = info.chatMessages
            .reverse()
            .map( message => {
                message.isFromFirstLoad = true;
                return message;
            } );
    }

    private memberInfoToRoomMember( info: ReceivedRoomInfo.Member, isInRoom: boolean ): RoomMember {
        return {
            id: info.id,
            displayName: info.displayName,
            isAdmin: false,
            isInRoom: isInRoom,
            avatarURL: info.avatarURL
        }
    }

    public getMemberById( id: string ): RoomMember | null {
        return this.memberList.find( member => member.id == id ) || null;
    }
}