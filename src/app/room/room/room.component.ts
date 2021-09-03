import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { CookieService } from 'ngx-cookie-service';
import { ApplicationService } from 'src/app/core/application.service';
import { MessagingEvents } from 'src/app/core/messaging.service.events';
import { ReceivedRoomInfo } from 'src/app/core/room/received-room-info';
import { ReceivedRoomMedia } from 'src/app/core/room/received-room-media';
import { RoomMember } from 'src/app/core/room/room-info';
import { MessagingService } from '../../core/messaging.service';

@Component( {
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: [ './room.component.scss' ]
} )
export class RoomComponent implements OnInit {
    public roomId: string;
    public audioAutoPlay: boolean = false;

    public audioVolumeEmitter: EventEmitter<number> = new EventEmitter( false );
    public currentAudioVolume: number = 50;

    constructor( public app: ApplicationService, private cookies: CookieService, private route: ActivatedRoute, private router: Router, private httpClient: HttpClient, private msnService: MessagingService ) {
        this.roomId = this.route.snapshot.paramMap.get( "id" ) || "";
    }

    ngOnInit(): void {
        if ( !this.app.room ) {
            if ( this.cookies.check( `room_${this.roomId}` ) ) {
                this.msnService.connect( this.app.getRoomAccessInfoFromCookie( this.roomId ) );

                this.msnService.events.on( MessagingEvents.OnNewChatMessageReceived, this, this.onNewMessageReceived );
                this.msnService.events.on( MessagingEvents.OnMemberUpdate, this, this.onMemberUpdated );
                this.msnService.events.on( MessagingEvents.OnNewMediaReceived, this, this.onNewMediaReceived );
            } else {
                this.router.navigate( [ '/join', this.roomId ] );
            }
        }
    }

    public audioAutoPlayChange( e: MdbCheckboxChange ) {
        this.audioAutoPlay = e.checked;
    }

    public audioVolumeChange( e: { value: string } ) {
        this.currentAudioVolume = parseInt( e.value );

        this.audioVolumeEmitter.emit( this.currentAudioVolume );
    }

    private onNewMessageReceived( message: ReceivedRoomInfo.ChatMessage ) {
        this.app.room?.chatMessages.push( message );
    }

    private onMemberUpdated( target: RoomMember ) {
        this.app.room!.memberList = this.app.room!.memberList.filter( item => item.id != target.id );

        if ( target.isInRoom ) {
            this.app.room!.memberList.unshift( target );
        } else {
            this.app.room!.memberList.push( target );
        }
    }

    private onNewMediaReceived( media: ReceivedRoomMedia ) {
        media.canAutoPlay = ( media.authorMemberId != this.app.me?.id ) && this.audioAutoPlay;

        this.app.room?.media.push( media );
    }

    public onChatTextAreaKeypress( e: KeyboardEvent ): boolean {
        if ( e.key.toLowerCase() == "enter" && e.shiftKey == false ) {
            this.msnService.sendChatMessage( ( e.target as HTMLTextAreaElement ).value );

            ( e.target as HTMLTextAreaElement ).value = "";

            return false;
        }

        return true;
    }
}
