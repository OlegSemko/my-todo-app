import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../services/supabase-api.service";
import { AuthService } from "../services/auth.service";
import { BoardComponent } from "./board/board.component";
import { IBoard } from "../intrefaces";
import { Router } from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [BoardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit {
    supabaseAliService = inject(SupabaseApiService);
    authService = inject(AuthService);
    readonly boards: WritableSignal<IBoard[]> = signal<IBoard[]>([]);

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.getUsersBoards();
    }
    
    goToBoard(id: number) {
        this.router.navigate(['/boards', id]);
    }

    private getUsersBoards(): void {
        const currentUser = this.authService.currentUser();
        
        this.supabaseAliService.getUserBoards(currentUser?.id).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.boards.set(result.data);
            }
        })
    }
}
