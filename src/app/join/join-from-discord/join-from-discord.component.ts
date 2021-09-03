import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/core/application.service';

@Component( {
    selector: 'app-join-from-discord',
    templateUrl: './join-from-discord.component.html',
    styleUrls: [ './join-from-discord.component.scss' ]
} )
export class JoinFromDiscordComponent implements OnInit {

    constructor( private route: ActivatedRoute, private app: ApplicationService ) {
        let params = this.route.snapshot.queryParamMap;

        this.app.requestToJoinRoomFromDiscord(
            params.get( 'state' )!,
            params.get( 'code' )!
        );
    }

    ngOnInit(): void {

    }

}
