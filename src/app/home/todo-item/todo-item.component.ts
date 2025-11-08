import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";
import { IToDo } from "../../intrefaces";


@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
    imports: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent {
    readonly todo: InputSignal<IToDo> = input.required<IToDo>();
}
