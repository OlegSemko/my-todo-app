import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found-page/not-found.component';
import { BoardDetailsComponent } from './home/board-details/board-details.component';
import { CreateBoardComponent } from './home/create-board/create-board.component';
import { CreateTaskComponent } from './home/create-task/create-task.component';

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
    { path: 'boards', component: HomeComponent },
    { path: 'boards/:id', component: BoardDetailsComponent },
    { path: 'boards/:id/create-task', component: CreateTaskComponent },
    { path: 'create-board', component: CreateBoardComponent },
    { path: '**', component: NotFoundComponent }
];
