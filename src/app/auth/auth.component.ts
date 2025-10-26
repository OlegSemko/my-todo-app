import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    imports: [
        RouterModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthComponent {
}
