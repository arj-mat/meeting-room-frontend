import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/core/application.service';
import { RoomChatMessage, RoomMember } from 'src/app/core/room/room-info';

import * as moment from 'moment';
import 'moment/locale/pt';
import { ReceivedRoomInfo } from 'src/app/core/room/received-room-info';
import { UserFriendlyDateTimePipe } from 'src/app/shared/pipes/user-friendly-date-time.pipe';

moment.locale( 'pt' );

@Component( {
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: [ './chat-message.component.scss' ]
} )
export class ChatMessageComponent implements OnInit {
    @Input()
    public message!: ReceivedRoomInfo.ChatMessage;

    public author!: ReceivedRoomInfo.Member;

    constructor( private elem: ElementRef<HTMLDivElement>, private app: ApplicationService ) { }

    public formatedDate: string = "";

    ngOnInit(): void {
        this.author = this.app.room!.getMemberById( this.message.authorMemberId )!;

        this.setFormatedDate();

        this.scrollToChatBottom();

        setInterval( () => this.setFormatedDate(), 30000 );
    }

    private scrollToChatBottom() {
        setTimeout( () => {
            this.elem.nativeElement.parentElement!.scrollBy( { top: this.elem.nativeElement.parentElement!.scrollHeight } );

            this.isChatScrolledToBottom();
        }, 1 );
    }

    private scrollToBottomIfMust() {
        setTimeout( () => {
            console.log( "this height ", this.elem.nativeElement.offsetHeight );

            if ( this.elem.nativeElement.parentElement!.scrollTop >= ( this.elem.nativeElement.parentElement!.scrollHeight - this.elem.nativeElement.parentElement!.offsetHeight ) )
                this.elem.nativeElement.parentElement!.scrollBy( { top: this.elem.nativeElement.parentElement!.scrollHeight } );
        }, 1 );
    }

    private setFormatedDate(): void {
        this.formatedDate = new UserFriendlyDateTimePipe().transform( this.message.date );
    }

    public isLastMessageInChat(): boolean {
        return this.elem.nativeElement.parentElement?.lastElementChild == this.elem.nativeElement;
    }

    public isChatScrolledToBottom(): boolean {
        return Math.ceil
            (
                ( this.elem.nativeElement.parentElement?.offsetHeight || 0 )
                +
                ( this.elem.nativeElement.parentElement?.scrollTop || 0 )
            )
            >=
            ( this.elem.nativeElement.parentElement?.scrollHeight || 1 );
    }
}
