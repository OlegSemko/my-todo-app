import { Injectable, signal, WritableSignal } from "@angular/core";
import { AuthResponse, createClient } from "@supabase/supabase-js";
import { environment } from "../../environments/environment.development";
import { from, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    currentUser: WritableSignal<{email: string, username: string} | null> = signal<{email: string, username: string} | null>(null);

    register(email: string, username: string, password: string): Observable<AuthResponse> {
        const promise = this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });
        return from(promise);
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const promise = this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        return from(promise);
    }

    logout(): void {
        this.supabase.auth.signOut();
    }
}
