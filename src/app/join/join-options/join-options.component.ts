import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component( {
    selector: 'app-join-options',
    templateUrl: './join-options.component.html',
    styleUrls: [ './join-options.component.scss' ]
} )
export class JoinOptionsComponent implements OnInit {
    public showSharingOptions: boolean;
    public roomSharingURL: string;
    public roomId: string;

    constructor( private activedRoute: ActivatedRoute ) {
        this.roomId = this.activedRoute.snapshot.paramMap.get( 'id' )!;

        this.showSharingOptions = this.activedRoute.snapshot.queryParamMap.has( 'showSharingOptions' );
        this.roomSharingURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
    }

    ngOnInit(): void {
    }



    public proceedToJoinWithDiscord() {
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=882309719367249981&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fjoin%2Ffrom-discord&response_type=token&scope=identify&state=${this.roomId}`;
    }
}
