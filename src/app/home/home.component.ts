import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { SupabaseApiService } from "../services/supabase-api.service";
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit {
    supabaseAliService = inject(SupabaseApiService);
    authService = inject(AuthService);

    ngOnInit(): void {
        this.getUsersBoards();
    }

    private getUsersBoards(): void {
        const currentUser = this.authService.currentUser();
        this.supabaseAliService.getUserBoards(currentUser?.id).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
            }
        })
    }
}
