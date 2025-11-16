import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../services/supabase-api.service";
import { AuthService } from "../services/auth.service";
import { BoardComponent } from "./board/board.component";
import { IMemberBoard } from "../intrefaces";
import { Router, RouterModule } from "@angular/router";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [BoardComponent, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
    supabaseApiService = inject(SupabaseApiService);
    authService = inject(AuthService);
    readonly boards: WritableSignal<IMemberBoard[]> = signal<IMemberBoard[]>([]);
    readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    constructor(private router: Router) {
        effect(() => {
            const currentUser = this.authService.currentUser();

            !!currentUser && this.getUsersBoards(currentUser?.id);
        })
    }

    goToBoard(id: number) {
        this.router.navigate(['/boards', id]);
    }

    private getUsersBoards(currentUserId: string | undefined): void {   
        this.isLoading.set(true);
     
        this.supabaseApiService.getBoardsWithMembers(currentUserId)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                    this.boards.set(result.data);
                }
            });
    }
}
