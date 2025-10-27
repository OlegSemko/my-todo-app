import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { AuthResponse } from "@supabase/supabase-js";
import { from, Observable } from "rxjs";
import { SupabaseService } from "./supabase.service";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private supabase = inject(SupabaseService);

    currentUser: WritableSignal<{id: string | undefined, email: string, username: string} | null> = signal<{id: string | undefined, email: string, username: string} | null>(null);

    register(email: string, username: string, password: string): Observable<AuthResponse> {
        const promise = this.supabase.client.auth.signUp({
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
        const promise = this.supabase.client.auth.signInWithPassword({
            email,
            password,
        });
        return from(promise);
    }

    logout(): void {
        this.supabase.client.auth.signOut();
    }
}
