import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from "@angular/core";
import { IToDo } from "../../intrefaces";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { switchMap } from "rxjs/operators";


@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
    imports: [DatePipe, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent {
    private supabaseAliService = inject(SupabaseApiService);
    readonly todo: InputSignal<IToDo> = input.required<IToDo>();
    readonly status = new FormControl();

    ngOnInit(): void {
        this.status.setValue(this.todo().status, { emitEvent: false });
        this.status.valueChanges
            .pipe(
                switchMap((status: string | null) => this.supabaseAliService.updateTodo(this.todo().id, { status }))
            )
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                }
            });
    }

    deleteItem(): void {
        console.log('delete');
        this.supabaseAliService.deleteTodo(this.todo().id)
            .subscribe((result) => {
                if (result.error) {
                    console.log('error',result.error?.message);
                } else {
                    console.log('success', result);
                };
            });
    }
}
