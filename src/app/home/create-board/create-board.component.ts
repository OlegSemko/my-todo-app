import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-create-board',
    templateUrl: './create-board.component.html',
    styleUrl: './create-board.component.scss',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateBoardComponent {
    private supabaseApiService = inject(SupabaseApiService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);

    boardCreateForm = this.fb.nonNullable.group({
        boardTitle: ['', Validators.required],
    });

    onSubmit(): void {
        const currentUser = this.authService.currentUser();
        const { boardTitle } = this.boardCreateForm.getRawValue();

        this.supabaseApiService.addBoard(currentUser?.id as string, boardTitle).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                this.router.navigateByUrl('/boards');
            }
        });
    }
}
