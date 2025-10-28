import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SupabaseService } from './services/supabase.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);
  protected readonly title = signal('my-todo-app');

  ngOnInit(): void {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.authService.currentUser.set({
          id: session?.user.id,
          username: session?.user.identities?.at(0)?.identity_data?.['username'],
          email: session?.user.email!
        })
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
      }
    })
  }
}
