import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinOptionsComponent } from '../join-options/join-options.component';
import { JoinWithEmailComponent } from '../join-with-email/join-with-email.component';
import { JoinScreenComponent } from './join-screen.component';

const routes: Routes = [
    {
        path: '',
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
    }
];

@NgModule( {
    imports: [ RouterModule.forChild( routes ) ],
    exports: [ RouterModule ]
} )
export class JoinScreenModule { }