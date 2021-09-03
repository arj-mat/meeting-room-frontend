import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessagingService } from 'src/app/core/messaging.service';
import { MessagingEvents } from 'src/app/core/messaging.service.events';

// Referência: https://github.com/arj-mat/Audicord/blob/master/web/content/static/new-audio.js

declare var MediaRecorder: any;

@Component( {
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: [ './audio-recorder.component.scss' ]
} )
export class AudioRecorderComponent implements OnInit {
    public isRecording: boolean = false;
    public isProccessingData: boolean = false;

    private mediaStream!: MediaStream;
    public recordingStartedAt: number = Date.now();
    public recordingDuration: string = "00:00";
    private recorder!: any;
    private chunks: Array<Blob> = [];

    private durationDisplayTimer: any;

    constructor( private msnService: MessagingService ) { }

    ngOnInit(): void {
        this.msnService.events.on( MessagingEvents.OnAudioRecordingSent, this, () => {
            this.isProccessingData = false;
            this.isRecording = false;
        } );
    }

    public updateRecordingDuration( value: string ) {
        this.recordingDuration = value;
    }

    public requestAudioRecording() {
        navigator.mediaDevices.getUserMedia( { audio: true } )
            .then( mediaStream => {
                this.chunks = [];

                this.mediaStream = mediaStream;

                this.recorder = new MediaRecorder( mediaStream );

                this.recorder.ondataavailable = this.onRecorderData.bind( this );

                this.recorder.start( 1000 );

                this.recordingStartedAt = Date.now();
                this.recordingDuration = "00:00";
                this.isRecording = true;

                this.durationDisplayTimer = setInterval( () => {
                    this.recordingDuration = moment( Date.now() - this.recordingStartedAt ).format( "mm:ss" );
                }, 500 );
            } )
            .catch( alert );
    }

    private onRecorderData( event: any ) {
        this.chunks.push( event.data );

        let duration = Date.now() - this.recordingStartedAt;

        if ( duration >= 120000 ) {
            this.stopRecording();
        }
    }

    public cancelRecording() {
        clearInterval( this.durationDisplayTimer );

        this.recorder.stop();
        this.mediaStream.getAudioTracks()[ 0 ].stop();

        this.chunks = [];

        this.isRecording = false;
    }

    public stopRecording() {
        clearInterval( this.durationDisplayTimer );

        this.recorder.onstop = this.proccessAndSendRecording.bind( this );
        this.recorder.stop();

        this.mediaStream.getAudioTracks()[ 0 ].stop();
    }

    private proccessAndSendRecording() {
        this.isProccessingData = true;

        let reader = new FileReader();

        reader.onload = () => {
            this.chunks = [];

            this.msnService.sendAudioRecording( reader.result?.toString() || "" );
        }

        reader.readAsDataURL( new Blob( this.chunks, { 'type': 'audio/ogg; codecs=opus' } ) );
    }
}
