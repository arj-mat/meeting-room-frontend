import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CookieService } from 'ngx-cookie-service';
import { myRxStompConfig } from '../my-rx-stomp.config';
import { RoomComponent } from '../room/room/room.component';
import Room from './room/room';
import { RoomMember } from './room/room-info';
import JoinRoomRequestDTO from './types/dto-model/join-room-with-email-request';
import { ReceivedRoomInfo } from './room/received-room-info';
import { RoomAccessInfo } from './room/room-access-info';
import JoinRoomWithEmailRequestDTO from './types/dto-model/join-room-with-email-request';
import JoinRoomFromOAuthRequestDTO from './types/dto-model/join-room-from-oauth';
import { RoomCreationResponse } from './room/room-creation-response';

const HOST = window.location.host == "localhost:4200" ? "http://localhost:8080" : "https://proj-meeting-room.herokuapp.com";

@Injectable( {
    providedIn: 'root',
    useValue: ApplicationService.instance
} )
export class ApplicationService {
    public static instance: ApplicationService;

    public host: string = HOST;

    public room?: Room;
    public me?: ReceivedRoomInfo.Member;
    public accessCode?: string;

    constructor( private httpClient: HttpClient, private cookies: CookieService, private route: ActivatedRoute, private router: Router ) {
        ApplicationService.instance = this;
    }

    public static StartRxStompService(): RxStompService {
        let stomp = new RxStompService();
        stomp.configure( myRxStompConfig );
        stomp.activate();
        return stomp;
    }

    public getRoomAccessInfoFromCookie( roomId: string ): RoomAccessInfo {
        return JSON.parse( atob( this.cookies.get( `room_${roomId}` ) ) );
    }

    public saveRoomAccessInfo( info: RoomAccessInfo ) {
        this.cookies.delete( `room_${info.roomId}`, '/' );

        this.cookies.set( `room_${info.roomId}`, btoa( JSON.stringify( info ) ), undefined, '/' );
    }

    public async requestToJoinRoomWithEmail( roomId: string, name: string, email: string ) {
        let request: JoinRoomWithEmailRequestDTO = {
            name: name,
            email: email
        }

        this.httpClient.post<RoomAccessInfo>( `${HOST}/api/join-room/${roomId}/with-email`, request ).toPromise()
            .then( response => {
                this.saveRoomAccessInfo( response );

                this.router.navigate( [ '/room', roomId ], { relativeTo: this.route.root } );
            } )
            .catch( err => {
                console.log( err );
            } );
    }

    public async requestToJoinRoomFromDiscord( roomId: string, token: string ) {
        console.log( "requestToJoinRoomFromDiscord" );

        this.httpClient.get<RoomAccessInfo>( `${HOST}/api/join-room/${roomId}/from-discord?token=${token}` ).toPromise()
            .then( response => {
                this.saveRoomAccessInfo( response );

                this.router.navigate( [ '/room', roomId ], { relativeTo: this.route.root } );
            } )
            .catch( err => {
                console.log( err );
            } );
    }

    public async createNewRoom( name: string ): Promise<string> {
        return this.httpClient.post<RoomCreationResponse>( `${HOST}/api/new-room`, {
            name: name
        } ).toPromise()
            .then( response => {
                if ( response.success && response.roomId )
                    return response.roomId;
                else
                    return Promise.reject( response.error );
            } )
            .catch( ( e: HttpErrorResponse ) => {
                return Promise.reject( `${e.name} ${e.status}` );
            } );
    }
}
