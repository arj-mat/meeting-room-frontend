import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { ReceivedRoomInfo } from './room/received-room-info';
import { UserIdentificationMessage } from './types/user-identification-message';
import { MessagingEvents, MessagingServiceEvents } from './messaging.service.events';
import { RoomAccessInfo } from './room/room-access-info';
import Room from './room/room';
import { RoomMediaSyncAvailabilityAnswer, RoomMediaSyncAvailabilityRequest, RoomMediaSyncData, RoomMediaSyncRequest, RoomMediaSyncRequestAnswer } from './room/room-media-availability-messages';

// Declare SockJS and Stomp
declare var SockJS: any;
declare var Stomp: any;

// Referência: https://spring.io/guides/gs/messaging-stomp-websocket/

@Injectable( {
    providedIn: 'root',
    useValue: MessagingService.instance
} )
export class MessagingService {
    public static instance: MessagingService;

    private stompClient: any = null;

    public events: MessagingServiceEvents = new MessagingServiceEvents();

    constructor( private app: ApplicationService ) {
        MessagingService.instance = this;
    }

    public get isConnected(): boolean {
        return this.stompClient.connected();
    }

    public connect( roomAccessInfo: RoomAccessInfo ): void {
        let socket = new SockJS( `${this.app.host}/gs-guide-websocket` );

        this.stompClient = Stomp.over( socket );

        this.stompClient.debug = null;

        this.stompClient.connect( {}, ( frame: any ) => {
            console.log( "[CONECTADO] ", frame, this );

            this.stompClient.ws.onclose = this.onDisconnect.bind( this );

            this.stompClient.subscribe( '/connections/chat-output', ( message: any ) => {
                console.log( "[RECEBIDO CHAT] ", message.body );

                this.events.fire( MessagingEvents.OnNewChatMessageReceived, [ JSON.parse( message.body ) ] );
            } );

            this.stompClient.subscribe( '/connections/member-update', ( message: any ) => {
                console.log( "[RECEBIDO MEMBER UPDATE] ", message.body );

                this.events.fire( MessagingEvents.OnMemberUpdate, [ JSON.parse( message.body ) ] );
            } );

            this.stompClient.subscribe( '/connections/identification-request', () => {
                console.log( "[RECEBIDO IDENTIFICATION REQUEST] " );

                this.send( "/inputs/identify",
                    {
                        accessCode: roomAccessInfo.accessCode,
                        roomId: roomAccessInfo.roomId,
                        memberId: roomAccessInfo.memberId
                    } as UserIdentificationMessage
                );
            } );

            this.stompClient.subscribe( '/connections/room-info', ( message: any ) => {
                console.log( "[RECEBIDO ROOM INFO] " );

                let data: ReceivedRoomInfo.Data = JSON.parse( message.body );

                this.app.room = new Room( data, roomAccessInfo.roomId );
                this.app.me = data.me;
            } );

            this.stompClient.subscribe( '/connections/audio-recording-sent', ( message: any ) => {
                this.events.fire( MessagingEvents.OnAudioRecordingSent, [ JSON.parse( message.body ) ] );
            } );

            this.stompClient.subscribe( '/connections/new-media', ( message: any ) => {
                console.log( "NEW MEDIA!" );

                this.events.fire( MessagingEvents.OnNewMediaReceived, [ JSON.parse( message.body ) ] );
            } );

            this.stompClient.subscribe( '/connections/media-sync-availability-request', ( message: any ) => {
                this.answerMediaSyncAvailabilityRequest( JSON.parse( message.body ) );
            } );

            this.stompClient.subscribe( '/connections/media-sync-request', ( message: any ) => {
                this.answerMediaSyncRequest( JSON.parse( message.body ) );
            } );

            this.stompClient.subscribe( '/connections/media-sync-data', ( message: any ) => {
                this.events.fire( MessagingEvents.OnMediaSyncDataReceived, [ JSON.parse( message.body ) ] );
            } );

            this.stompClient.subscribe( '/connections/media-sync-not-available', ( message: any ) => {
                this.events.fire( MessagingEvents.OnMediaSyncDataNotAvailable, [ JSON.parse( message.body ) ] );
            } );

            this.setPingTimeout();
        } );
    }

    private answerMediaSyncAvailabilityRequest( request: RoomMediaSyncAvailabilityRequest ) {
        let mediaDataAvailable: boolean = this.app.room?.media.find( media => media.id == request.mediaId )?.data != undefined;

        let response: RoomMediaSyncAvailabilityAnswer = {
            requestId: request.requestId,
            isAvailable: mediaDataAvailable
        }

        this.send( "/inputs/answer-media-sync-availability", response );
    }

    private answerMediaSyncRequest( request: RoomMediaSyncRequest ) {
        let mediaData: string = this.app.room?.media.find( media => media.id == request.mediaId )?.data!;

        let response: RoomMediaSyncRequestAnswer = {
            requestId: request.requestId,
            data: mediaData
        }

        this.send( "/inputs/media-sync-data", response );
    }

    private setPingTimeout(): void {
        setTimeout( () => {
            if ( this.stompClient.connected ) {
                this.send( "/inputs/ping", "" );

                this.setPingTimeout();
            }
        }, 30000 );
    }

    private onDisconnect(): void {
        delete this.app.room;
        delete this.app.me;

        // this.connect();
    }

    private send( endpoint: string, payload: any ): void {
        this.stompClient.send(
            `${endpoint}`,
            {},
            typeof payload == 'object' ? JSON.stringify( payload ) : payload
        );
    }

    public sendChatMessage( content: string ): void {
        this.send( "/inputs/chat", content );
    }

    public sendAudioRecording( data: string ): void {
        this.send( "/inputs/audio-recording", data );
    }

    public sendRoomMediaSyncAvailabilityRequest( mediaId: string ) {
        this.send( "/inputs/request-media-sync-availability", mediaId );
    }
}
