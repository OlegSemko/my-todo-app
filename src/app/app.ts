import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  protected readonly title = signal('my-todo-app');

  ngOnInit(): void {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.authService.currentUser.set({
          username: session?.user.identities?.at(0)?.identity_data?.['username'],
          email: session?.user.email!
        })
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
      }
      console.log('event', event);
      console.log('session', session);
    })
  }

  logout(): void {
    this.authService.logout();
  }
}
