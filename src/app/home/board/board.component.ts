import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";
import { IMemberBoard } from "../../intrefaces";


@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardComponent {
    readonly board: InputSignal<IMemberBoard> = input.required<IMemberBoard>();
}
