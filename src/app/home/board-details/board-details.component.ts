import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { IToDo } from "../../intrefaces";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TodoItemComponent } from "../todo-item/todo-item.component";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-board-details',
    templateUrl: './board-details.component.html',
    styleUrl: './board-details.component.scss',
    imports: [ReactiveFormsModule, TodoItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardDetailsComponent implements OnInit {
    private supabaseAliService = inject(SupabaseApiService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    readonly todos: WritableSignal<IToDo[]> = signal<IToDo[]>([]);
    readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    private boardId: number = 0;

    todoCreateForm = this.fb.nonNullable.group({
        todoTitle: ['', Validators.required],
        todoDescription: ['', Validators.required]
    });

    ngOnInit(): void {
        this.boardId = +this.route.snapshot.paramMap.get('id')!;
        this.getUsersTodos();
    }

    onSubmit(): void {
        const currentUser = this.authService.currentUser();
        const { todoTitle, todoDescription } = this.todoCreateForm.getRawValue();

        this.supabaseAliService.addTodo(currentUser?.id as string, this.boardId, todoTitle, todoDescription).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.getUsersTodos();
            }
        });
    }

    private getUsersTodos(): void {
        this.isLoading.set(true);
        this.supabaseAliService.getBoardTodos(this.boardId)
            .pipe(finalize((() => this.isLoading.set(false))))
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                    this.todos.set(result.data);
                }
        })
    }
}
