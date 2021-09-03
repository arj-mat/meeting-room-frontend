import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component( {
    selector: 'app-join-screen',
    templateUrl: './join-screen.component.html',
    styleUrls: [ './join-screen.component.scss' ]
} )
export class JoinScreenComponent implements OnInit {
    public roomId: string;
    constructor( private activedRoute: ActivatedRoute ) {
        // O formato da URL contém, primeiro, o ID da sala de 36 caracteres e em seguida o nome. Encodificado em Base 64.

        this.roomId = this.activedRoute.snapshot.queryParamMap.get( 'room' )!;
    }

    ngOnInit(): void {
    }


}
