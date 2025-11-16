import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [
        RouterModule,
        RouterLinkActive
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/auth/login');
    }
}
