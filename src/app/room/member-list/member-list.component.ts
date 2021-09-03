import { Component, Input, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/core/application.service';
import { RoomChatMessage } from 'src/app/core/room/room-info';

@Component( {
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: [ './member-list.component.scss' ]
} )
export class MemberListComponent implements OnInit {

    constructor() { }

    public app: ApplicationService = ApplicationService.instance;

    ngOnInit(): void {

    }

}
