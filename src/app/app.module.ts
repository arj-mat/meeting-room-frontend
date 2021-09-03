import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
//import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
//import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
//import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
//import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
//import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
//import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
//import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
//import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
//import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessagingService } from './core/messaging.service';
import { RoomComponent } from './room/room/room.component';
import { MemberListComponent } from './room/member-list/member-list.component';
import { ChatMessageComponent } from './room/chat-message/chat-message.component';
import { UserAvatarComponent } from './shared/user-avatar/user-avatar/user-avatar.component';
import { ChatAudioComponent } from './room/chat-audio/chat-audio/chat-audio.component';
import { JoinScreenComponent } from './join/join-screen/join-screen.component';
import { JoinWithEmailComponent } from './join/join-with-email/join-with-email.component';
import { JoinOptionsComponent } from './join/join-options/join-options.component';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData( localePt );

import { CookieService } from 'ngx-cookie-service';
import { SpinnerComponent } from './shared/spinner/spinner/spinner.component';
import { ConnectingOverlayComponent } from './room/connecting-overlay/connecting-overlay.component';
import { ApplicationService } from './core/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JoinFromDiscordComponent } from './join/join-from-discord/join-from-discord.component';
import { AudioRecorderComponent } from './room/audio-recorder/audio-recorder.component';
import { UserFriendlyDateTimePipe } from './shared/pipes/user-friendly-date-time.pipe';
import { CreateRoomComponent } from './create-room/create-room.component';

@NgModule( {
    declarations: [
        AppComponent,
        RoomComponent,
        MemberListComponent,
        ChatMessageComponent,
        UserAvatarComponent,
        ChatAudioComponent,
        JoinScreenComponent,
        JoinWithEmailComponent,
        JoinOptionsComponent,
        SpinnerComponent,
        ConnectingOverlayComponent,
        JoinFromDiscordComponent,
        AudioRecorderComponent,
        UserFriendlyDateTimePipe,
        CreateRoomComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        // MdbAccordionModule,
        // MdbCarouselModule,
        MdbCheckboxModule,
        // MdbCollapseModule,
        //  MdbDropdownModule,
        MdbFormsModule,
        MdbModalModule,
        //  MdbPopoverModule,
        //  MdbRadioModule,
        MdbRangeModule,
        //  MdbRippleModule,
        //  MdbScrollspyModule,
        //  MdbTabsModule,
        MdbTooltipModule,
        MdbValidationModule,
        // NoopAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        CookieService,
        MessagingService,
        {
            provide: LOCALE_ID,
            useValue: 'pt-BR'
        },
        /*
            Esse provider garante que o ApplicationService esteja inicializado logo no começo da aplicação,
            visto que sua instância (ApplicationService.instance) é requerida por vários componmentes do projeto.

            Referências:
            https://stackoverflow.com/a/44731279
            https://angular.io/guide/dependency-injection-providers#using-factory-providers
            https://stackoverflow.com/questions/46076051/this-appinitsi-is-not-a-function
        */
        {
            provide: APP_INITIALIZER,
            useFactory: ( httpClient: HttpClient, cookieService: CookieService, route: ActivatedRoute, router: Router ) => {
                return () => { return new ApplicationService( httpClient, cookieService, route, router ) }
            },
            deps: [ HttpClient, CookieService, ActivatedRoute, Router ], // Garante que os serviços estejam disponíveis para o constructor do ApplicationService.
            multi: true
        }
    ],
    bootstrap: [ AppComponent ]
} )
export class AppModule { }
