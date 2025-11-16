import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { IToDo, IUser } from "../../intrefaces";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
    private supabaseApiService = inject(SupabaseApiService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    readonly todos: WritableSignal<IToDo[]> = signal<IToDo[]>([]);
    readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
    readonly members: WritableSignal<any[]> = signal<IUser[]>([]);

    private boardId: number = 0;

    ngOnInit(): void {
        this.boardId = +this.route.snapshot.paramMap.get('id')!;
        this.getUsersTodos();
        this.getAllUsers();
    }

    addUserToBoard(event: Event): void {
        console.log('event', event);
        this.supabaseApiService.addUserToBoard(this.boardId, (event.target as HTMLSelectElement).value)
        .subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
            }
        })
    }

    handleCreateTask(): void {
        this.router.navigate(['/boards', this.boardId, 'create-task']);
    }

    private getUsersTodos(): void {
        this.isLoading.set(true);
        this.supabaseApiService.getBoardTodos(this.boardId)
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

    private getAllUsers(): void {
        this.supabaseApiService.getAllUsers()
            .subscribe((result: any) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                    this.members.set(result.data);
                }
            })
    }
}
