import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, InputSignal, signal, WritableSignal } from "@angular/core";
import { IToDo, IUser, IToDoComment } from "../../intrefaces";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-todo-details',
    templateUrl: './todo-details.component.html',
    styleUrl: './todo-details.component.scss',
    imports: [DatePipe, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoDetailsComponent {
    private supabaseApiService = inject(SupabaseApiService);
    private authService = inject(AuthService);
    readonly todo: WritableSignal<IToDo | undefined> = signal<IToDo | undefined>(undefined);
    readonly members: WritableSignal<IUser[] | undefined> = signal<IUser[] | undefined>([]);
    readonly status = new FormControl();
    readonly priority = new FormControl();
    readonly dueDate = new FormControl();
    readonly assignee = new FormControl();
    readonly newComment = new FormControl();
    readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
    readonly taskComments: WritableSignal<IToDoComment[]> = signal<IToDoComment[]>([]);

    constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state?.['data']) {
      const receivedData = navigation.extras.state['data'];
      this.todo.set(receivedData.todo);
      this.members.set(receivedData.members);

      console.log('Received Todo:', receivedData);
    } else {
      console.warn('Navigation state not found. Redirecting or showing error...');
      this.router.navigate(['/boards']);
    }
  }

    ngOnInit(): void {
        this.status.setValue(this.todo()?.status, { emitEvent: false });
        this.priority.setValue(this.todo()?.priority, { emitEvent: false });
        this.dueDate.setValue(this.todo()?.due_date, { emitEvent: false });
        this.assignee.setValue(this.todo()?.assignee_id, { emitEvent: false });
        this.getTaskComments();

        this.priority.valueChanges
            .subscribe((priority: number) => {
                this.updateToDo({priority});
            });

        this.status.valueChanges
            .subscribe((status: string) => {
                this.updateToDo({status});
            });

        this.dueDate.valueChanges
            .subscribe((dueDate: string) => {
                this.updateToDo({due_date: dueDate});
            });

        this.assignee.valueChanges
            .subscribe((assigneeId: string) => {
                this.updateToDo({assignee_id: assigneeId});
            });
    }

    deleteItem(): void {
        this.supabaseApiService.deleteTodo(this.todo()?.id)
            .subscribe();
    }

    addComment(): void {
        console.log('adding');
        const comment = this.newComment.value;
        const currentUserId = this.authService.currentUser()?.id;
        this.supabaseApiService.addTaskComment(this.todo()?.id, comment, currentUserId)
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    // update list of comments from response
                }
            });
    }

    private getTaskComments(): void {
        this.supabaseApiService.getTaskComments(this.todo()?.id)
            .pipe(finalize((() => this.isLoading.set(false))))
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    this.taskComments.set(result.data);
                }
            })
    }

    private updateToDo(body: Partial<IToDo>): void {
        this.supabaseApiService.updateTodo(this.todo()?.id, body)
            .subscribe();
    }
}
