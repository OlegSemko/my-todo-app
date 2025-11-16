import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrl: './create-task.component.scss',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateTaskComponent {
    private supabaseApiService = inject(SupabaseApiService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private boardId: number = 0;

    taskCreateForm = this.fb.nonNullable.group({
        taskTitle: ['', Validators.required],
        taskDescription: ['', Validators.required]
    });

    ngOnInit(): void {
        this.boardId = +this.route.snapshot.paramMap.get('id')!;
    }

    onSubmit(): void {
        const currentUser = this.authService.currentUser();
        const { taskTitle, taskDescription } = this.taskCreateForm.getRawValue();

        this.supabaseApiService.addTodo(currentUser?.id as string, this.boardId, taskTitle, taskDescription).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.router.navigate(['boards', this.boardId]);
            }
        });
    }
}
