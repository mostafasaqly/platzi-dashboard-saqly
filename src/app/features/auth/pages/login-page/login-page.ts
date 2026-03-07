import { Component, computed, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { AuthFacade } from '../../facades/auth.facade';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';

type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AppLogo, ...UI_PRIMENG],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly authFacade = inject(AuthFacade);

  protected readonly form: LoginFormGroup = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  protected readonly submitted = computed(
    () => this.authFacade.loginState().status === 'loading'
  );

  protected get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  protected get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  protected async onSubmit(): Promise<void> {
  this.form.markAllAsTouched();

  if (this.form.invalid || this.submitted()) {
    const firstError = document.querySelector('.ng-invalid');
    (firstError as HTMLElement)?.focus();
    return;
  }

  await this.authFacade.login(this.form.getRawValue());
}
}
