import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";
import { IMemberBoard } from "../../intrefaces";


@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardComponent {
    readonly board: InputSignal<IMemberBoard> = input.required<IMemberBoard>();
}
