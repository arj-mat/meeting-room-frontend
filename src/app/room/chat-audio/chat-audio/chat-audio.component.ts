import { Component, ElementRef, EventEmitter, Input, OnInit } from '@angular/core';
import { Howl } from 'howler';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApplicationService } from 'src/app/core/application.service';
import { MessagingService } from 'src/app/core/messaging.service';
import { MessagingEvents } from 'src/app/core/messaging.service.events';
import { ReceivedRoomMedia } from 'src/app/core/room/received-room-media';
import { RoomMember } from 'src/app/core/room/room-info';
import { RoomMediaSyncData, RoomMediaSyncDataNotAvailable } from 'src/app/core/room/room-media-availability-messages';

@Component( {
    selector: 'app-chat-audio',
    templateUrl: './chat-audio.component.html',
    styleUrls: [ './chat-audio.component.scss' ]
} )
export class ChatAudioComponent implements OnInit {
    @Input()
    public media!: ReceivedRoomMedia;

    private currentVolume: number = 50;

    public author!: RoomMember;

    public howl: Howl | null = null; // Howler.js https://github.com/goldfire/howler.js

    public hasBeenPlayedBefore: boolean = false;

    public audioDuration: string = "--:--";
    public currentAudioPosition: string = "00:00";

    public isSynchronizing: boolean = false;
    public isPlaying: boolean = false;
    public currentPlaybackRate: number = 1;
    public isDefinitivelyUnavailable: boolean = false;

    private audioPositionTimer: any;

    constructor( private app: ApplicationService, private msnService: MessagingService, private elem: ElementRef<HTMLDivElement> ) { }

    ngOnInit(): void {
        this.author = this.app.room?.getMemberById( this.media.authorMemberId )!;

        this.hasBeenPlayedBefore = localStorage.getItem( `media_played_${this.media.id}` ) != null;

        if ( this.media.data )
            this.initPlayer( this.media.canAutoPlay || false );
        else {
            this.msnService.events.on( MessagingEvents.OnMediaSyncDataReceived, this, this.onMediaSyncDataReceived );
            this.msnService.events.on( MessagingEvents.OnMediaSyncDataNotAvailable, this, this.onMediaSyncDataNotAvailable );
        }

        this.scrollListToBottom();
    }

    @Input()
    public set volume( value: number | undefined | null ) {
        if ( value === undefined || value === null )
            this.currentVolume = 50;
        else
            this.currentVolume = value;

        this.howl?.volume( ( this.currentVolume || 0 ) / 100 );
    }

    private onMediaSyncDataReceived( received: RoomMediaSyncData ) {
        if ( received.mediaId == this.media.id && !this.media.data ) {
            this.isSynchronizing = false;
            this.media.data = received.data;
            this.initPlayer( true );
        }
    }

    private onMediaSyncDataNotAvailable( received: RoomMediaSyncDataNotAvailable ) {
        if ( received.mediaId == this.media.id && !this.media.data ) {
            this.isSynchronizing = false;
            this.isDefinitivelyUnavailable = true;
        }
    }

    private scrollListToBottom() {
        setTimeout( () => {
            this.elem.nativeElement.parentElement!.scrollBy( { top: this.elem.nativeElement.parentElement!.scrollHeight } );
        }, 1 );
    }

    public playOrStop() {
        if ( !this.media.data ) {
            this.msnService.sendRoomMediaSyncAvailabilityRequest( this.media.id );
            this.isSynchronizing = true;
        } else if ( this.howl?.playing() ) {
            this.stop();
        } else {
            this.howl?.play();
        }
    }

    public setPlaybackRate( rate: number ) {
        this.currentPlaybackRate = rate;
        this.howl?.rate( rate );
    }

    private setAudioDuration() {
        this.audioDuration = moment( new Date( this.howl!.duration() * 1000 ) ).format( "mm:ss" );
    }

    private onPlay() {
        this.currentAudioPosition = "00:00";
        this.isPlaying = true;

        this.audioPositionTimer = setInterval( () => {
            this.currentAudioPosition = moment( new Date( ( this.howl!.seek() as number ) * 1000 ) ).format( "mm:ss" );
        }, 500 );
    }

    private onPlayEnd() {
        this.hasBeenPlayedBefore = true;
        localStorage.setItem( `media_played_${this.media.id}`, '1' );

        this.stop();
    }

    private initPlayer( autoPlay: boolean ) {
        this.howl = new Howl( {
            autoplay: autoPlay,
            loop: false,
            src: [ this.media.data! ],
            volume: ( this.currentVolume / 100 ) || 0
        } )
            .once( 'load', this.setAudioDuration.bind( this ) )
            .on( 'play', this.onPlay.bind( this ) )
            .on( 'end', this.onPlayEnd.bind( this ) )
            .on( 'stop', this.stop.bind( this ) );
    }

    private stop() {
        this.isPlaying = false;
        clearInterval( this.audioPositionTimer );

        if ( this.howl?.playing() )
            this.howl.stop();
    }
}
