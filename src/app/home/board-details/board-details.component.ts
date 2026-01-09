import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { IMemberBoard, IToDo, IUser } from "../../intrefaces";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TodoItemComponent } from "../todo-item/todo-item.component";
import { finalize } from "rxjs/operators";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-board-details',
    templateUrl: './board-details.component.html',
    styleUrl: './board-details.component.scss',
    imports: [ReactiveFormsModule, TodoItemComponent, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardDetailsComponent implements OnInit {
    private supabaseApiService = inject(SupabaseApiService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    readonly todos: WritableSignal<IToDo[]> = signal<IToDo[]>([]);
    readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
    readonly members: WritableSignal<IUser[]> = signal<IUser[]>([]);
    readonly membersWithOwner: Signal<(IUser | undefined)[]> = computed(() => {
        const members = this.board()?.members ?? [];
        return [this.board()?.owner, ...members];
    });
    readonly toDoStatusTasks: Signal<IToDo[]> = computed(() => {
        return this.todos().filter((todo: IToDo) => todo.status === 'to-do').sort((a: IToDo, b: IToDo) => b.priority - a.priority)
    });

    readonly inProgressStatusTasks: Signal<IToDo[]> = computed(() => {
        return this.todos().filter((todo: IToDo) => todo.status === 'in-progress').sort((a: IToDo, b: IToDo) => b.priority - a.priority)
    });

    readonly doneStatusTasks: Signal<IToDo[]> = computed(() => {
        return this.todos().filter((todo: IToDo) => todo.status === 'done').sort((a: IToDo, b: IToDo) => b.priority - a.priority)
    });

    readonly board: WritableSignal<IMemberBoard | undefined> = signal<IMemberBoard | undefined>(undefined);

    private boardId: number = 0;

    ngOnInit(): void {
        this.boardId = +this.route.snapshot.paramMap.get('id')!;
        this.getBoardDetails();
        this.getUsersTodos();
        this.getAllUsers();
    }

    addUserToBoard(userEmail: string): void {
        const matchedUser = this.members().find((member: IUser) => member.email === userEmail);

        if (!matchedUser) {
            alert(`The user with e-mail: ${userEmail} is not found`);
            return;
        }

        this.supabaseApiService.addUserToBoard(this.boardId, matchedUser.id)
        .subscribe()
    }

    handleCreateTask(): void {
        this.router.navigate(['/boards', this.boardId, 'create-task']);
    }


    reloadTodos(): void {
        this.getUsersTodos();
    }

    private getUsersTodos(): void {
        this.isLoading.set(true);
        this.supabaseApiService.getBoardTodos(this.boardId)
            .pipe(finalize((() => this.isLoading.set(false))))
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
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
                    this.members.set(result.data);
                }
            })
    }

    private getBoardDetails(): void {
        this.supabaseApiService.getBoardDetails(this.boardId)
            .pipe(finalize((() => this.isLoading.set(false))))
            .subscribe((result) => {
                if (result.error) {
                    console.error('error',result.error?.message);
                } else {
                    this.board.set(result.data);
                }
            })
    }
}
