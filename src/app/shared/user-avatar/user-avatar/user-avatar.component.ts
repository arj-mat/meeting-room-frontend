import { Component, Input, OnInit } from '@angular/core';

@Component( {
    selector: 'app-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: [ './user-avatar.component.scss' ]
} )
export class UserAvatarComponent implements OnInit {

    constructor() {
        /*const avatarColors = [
            "var(--mdb-blue)",
            "var(--mdb-indigo)",
            "var(--mdb-purple)",
            "var(--mdb-pink)",
            "var(--mdb-red)",
            "var(--mdb-orange)",
            "var(--mdb-yellow)",
            "var(--mdb-green)",
            "var(--mdb-teal)",
            "var(--mdb-cyan)",
            "var(--mdb-gray)",
            "var(--mdb-gray-dark)",
            "var(--mdb-primary)",
            "var(--mdb-secondary)",
            "var(--mdb-success)",
            "var(--mdb-info)",
            "var(--mdb-warning)",
            "var(--mdb-danger)"
        ];*/
    }

    ngOnInit(): void {

    }

    public avatarColor: string = "teal";

    @Input()
    public isOffline?: boolean = false;

    @Input()
    public image?: string;

    @Input()
    public name: string = "";

    public getNameAbbreviation(): string {
        this.name = this.name.normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" );

        if ( this.name.indexOf( ' ' ) == -1 )
            return this.name[ 0 ].toUpperCase();

        return String( `${this.name[ 0 ]}${this.name.split( ' ' ).slice( -1 )?.shift()?.substr( 0, 1 ) || ''}` ).toUpperCase();
    }
}
