import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/core/application.service';


@Component( {
    selector: 'app-join-with-email',
    templateUrl: './join-with-email.component.html',
    styleUrls: [ './join-with-email.component.scss' ]
} )
export class JoinWithEmailComponent implements OnInit {
    public loginFields: FormGroup;
    public roomId: string;

    constructor( private activedRoute: ActivatedRoute, private fb: FormBuilder, private app: ApplicationService ) {
        // O formato da URL contém, primeiro, o ID da sala de 36 caracteres e em seguida o nome. Encodificado em Base 64.

        this.roomId = this.activedRoute.parent?.snapshot.paramMap.get( 'id' )!;

        this.loginFields = this.fb.group( {
            name: [ '', [ Validators.required, Validators.minLength( 3 ), Validators.maxLength( 50 ), Validators.pattern( '[\\w\\s\\.\\-À-ú\\(\\)]*' ), ] ],
            email: [ '', [ Validators.email ] ]
        } );
    }

    ngOnInit(): void {

    }

    public nonPristineFieldIsInvalid( field: string ): boolean {
        return this.loginFields.get( field )!.pristine == false && this.loginFields.get( field )?.invalid == true;
    }

    public getReasonForInvalidName(): string {
        let reasons: Array<string> = [];

        let value: string = this.loginFields.get( 'name' )!.value;

        let [ notAllowedChars ] = value.match( new RegExp( '[^\\w\\.\\s\\-À-ú\\(\\)]+' ) ) || [];

        if ( notAllowedChars )
            reasons.push( `O nome não pode conter os seguintes caracteres: ${notAllowedChars}` );

        if ( this.loginFields.get( 'name' )!.errors?.minlength )
            reasons.push( `O nome deve ter pelo menos 3 caracteres.` );

        if ( this.loginFields.get( 'name' )!.errors?.maxlength )
            reasons.push( `O nome deve ter no máximo 50 caracteres.` );

        if ( this.loginFields.get( 'name' )!.errors?.required )
            reasons.push( `O nome é obrigatório.` );

        return reasons.join( "\n" );
    }

    submit(): void {
        this.app.requestToJoinRoomWithEmail(
            this.roomId,
            this.loginFields.get( 'name' )!.value,
            this.loginFields.get( 'email' )!.value
        );
    }
}
