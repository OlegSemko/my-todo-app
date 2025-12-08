import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../services/supabase-api.service";
import { AuthService } from "../services/auth.service";
import { BoardComponent } from "./board/board.component";
import { IMemberBoard, IUser } from "../intrefaces";
import { Router, RouterModule } from "@angular/router";
import { finalize, map } from "rxjs/operators";

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

    private currentUser: { id: string | undefined; email: string; username: string; } | null | undefined;
    constructor(private router: Router) {
        effect(() => {
            this.currentUser = this.authService.currentUser();

            !!this.currentUser && this.getUsersBoards();
        })
    }

    goToBoard(id: number) {
        this.router.navigate(['/boards', id], { state: { board: this.boards().find((board: IMemberBoard) => board.id === id)} });
    }

    private getUsersBoards(): void {   
        this.isLoading.set(true);
     
        this.supabaseApiService.getBoardsWithMembers()
            .pipe(
                finalize(() => this.isLoading.set(false)),
                map((res) => {
                        if (res.error) {
                        return [];
                    } else {
                        const userId = this.currentUser?.id;
                        const usersBoards = res.data?.filter((board: IMemberBoard) => board.owner_id === userId || board.members.some((member: IUser) => member.id === userId));

                        return usersBoards as IMemberBoard[];
                    }
                })
            )
            .subscribe((result) => {
                this.boards.set(result);
            });
    }
}
