import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found-page/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    { path: 'home', component: HomeComponent },
    { path: '**', component: NotFoundComponent }
];
