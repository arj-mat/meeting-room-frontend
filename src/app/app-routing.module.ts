import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { JoinFromDiscordComponent } from './join/join-from-discord/join-from-discord.component';
import { JoinOptionsComponent } from './join/join-options/join-options.component';
import { JoinScreenComponent } from './join/join-screen/join-screen.component';
import { JoinWithEmailComponent } from './join/join-with-email/join-with-email.component';
import { RoomComponent } from './room/room/room.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CreateRoomComponent
    },
    {
        path: 'join-from/discord',
        pathMatch: 'full',
        component: JoinFromDiscordComponent
    },
    {
        path: 'join/:id',
        component: JoinScreenComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: JoinOptionsComponent
            },
            {
                path: 'with-email',
                component: JoinWithEmailComponent,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'room/:id',
        pathMatch: 'full',
        component: RoomComponent
    }
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
} )
export class AppRoutingModule { }
