import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent {
    fb = inject(FormBuilder);
    http = inject(HttpClient);
    router = inject(Router);
    authService = inject(AuthService);

    form = this.fb.nonNullable.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    errorMessage: WritableSignal<string | undefined> = signal<string>('');

    onSubmit(): void {
        const formValue = this.form.getRawValue();
        this.authService.login(
            formValue.email, formValue.password
        ).subscribe((result) => {
            if (result.error) {
                this.errorMessage.set(result.error?.message);
            } else {
                this.router.navigateByUrl('/');
            }
        })
    }
}
