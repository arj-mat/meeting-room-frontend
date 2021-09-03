import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../core/application.service';

@Component( {
    selector: 'app-create-room',
    templateUrl: './create-room.component.html',
    styleUrls: [ './create-room.component.scss' ]
} )
export class CreateRoomComponent implements OnInit {
    public roomFields: FormGroup;
    public isLoading: boolean = false;
    public errorMessage: string = "";

    constructor( private app: ApplicationService, private fb: FormBuilder, private router: Router ) {
        this.roomFields = this.fb.group( {
            name: [ '', [ Validators.required, Validators.minLength( 3 ), Validators.maxLength( 50 ), ] ]
        } );
    }

    ngOnInit(): void {
    }

    public nonPristineFieldIsInvalid( field: string ): boolean {
        return this.roomFields.get( field )!.pristine == false && this.roomFields.get( field )?.invalid == true;
    }

    public getReasonForInvalidName(): string {
        let reasons: Array<string> = [];

        if ( this.roomFields.get( 'name' )!.errors?.minlength )
            reasons.push( `O nome deve ter pelo menos 3 caracteres.` );

        if ( this.roomFields.get( 'name' )!.errors?.maxlength )
            reasons.push( `O nome deve ter no máximo 50 caracteres.` );

        if ( this.roomFields.get( 'name' )!.errors?.required )
            reasons.push( `O nome é obrigatório.` );

        return reasons.join( "\n" );
    }

    submit(): void {
        this.errorMessage = "";
        this.isLoading = true;

        this.app.createNewRoom( this.roomFields.get( 'name' )!.value )
            .then( ( createdRoomId: string ) => {
                this.router.navigate( [ '/join', createdRoomId ], {
                    queryParams: {
                        showSharingOptions: true
                    }
                } );
            } )
            .catch( reason => {
                this.isLoading = false;

                this.errorMessage = reason;
            } )
    }
}
