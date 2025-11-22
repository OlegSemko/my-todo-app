import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from "@angular/core";
import { IToDo, IUser } from "../../intrefaces";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SupabaseApiService } from "../../services/supabase-api.service";


@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
    imports: [DatePipe, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent {
    private supabaseApiService = inject(SupabaseApiService);
    readonly todo: InputSignal<IToDo> = input.required<IToDo>();
    readonly members: InputSignal<IUser[] | undefined> = input<IUser[] | undefined>();
    readonly status = new FormControl();
    readonly priority = new FormControl();
    readonly dueDate = new FormControl();
    readonly assignee = new FormControl();

    isExpanded = false;

    ngOnInit(): void {
        this.status.setValue(this.todo().status, { emitEvent: false });
        this.priority.setValue(this.todo().priority, { emitEvent: false });
        this.dueDate.setValue(this.todo().due_date, { emitEvent: false });
        this.assignee.setValue(this.todo().assignee_id, { emitEvent: false });

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
        console.log('delete');
        this.supabaseApiService.deleteTodo(this.todo().id)
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                };
            });
    }

    expand(): void {
        this.isExpanded = !this.isExpanded;
    }

    private updateToDo(body: Partial<IToDo>): void {
        this.supabaseApiService.updateTodo(this.todo().id, body)
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                }
            });
    }
}
