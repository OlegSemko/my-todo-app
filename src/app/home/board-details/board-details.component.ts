import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { IToDo } from "../../intrefaces";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-board-details',
    templateUrl: './board-details.component.html',
    styleUrl: './board-details.component.scss',
    imports: [ReactiveFormsModule, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardDetailsComponent implements OnInit {
    private supabaseAliService = inject(SupabaseApiService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    // http = inject(HttpClient);
    readonly todos: WritableSignal<IToDo[]> = signal<IToDo[]>([]);

    private boardId: number = 0;

    todoCreateForm = this.fb.nonNullable.group({
        todoTitle: ['', Validators.required],
        todoDescription: ['', Validators.required]
    });

    ngOnInit(): void {
        this.getUsersBoards();
        this.boardId = +this.route.snapshot.paramMap.get('id')!;
    }

    onSubmit(): void {
        const currentUser = this.authService.currentUser();
        const { todoTitle, todoDescription } = this.todoCreateForm.getRawValue();

        this.supabaseAliService.addTodo(currentUser?.id as string, todoTitle, todoDescription).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.todos.set(result.data);
            }
        });
    }

    private getUsersBoards(): void {
        this.supabaseAliService.getBoardTodos(this.boardId).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.todos.set(result.data);
            }
        })
    }
}
