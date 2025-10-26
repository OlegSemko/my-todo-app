import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
}
