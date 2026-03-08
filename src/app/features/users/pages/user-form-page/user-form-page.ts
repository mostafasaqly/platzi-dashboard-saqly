import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { CreateUserDto } from '../../models/create-user.dto';
import { UpdateUserDto } from '../../models/update-user.dto';
import { UsersFacade } from '../../facades/users.facade';

type UserFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<string>;
  avatar: FormControl<string>;
}>;

@Component({
  selector: 'app-user-form-page',
  imports: [ReactiveFormsModule, ...UI_PRIMENG],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
})
export class UserFormPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly usersFacade = inject(UsersFacade);
  protected readonly isEditMode = signal(false);
  protected readonly userId = signal<number | null>(null);
  protected readonly pageReady = signal(false);
  protected readonly pageError = signal<string | null>(null);

  protected readonly form: UserFormGroup = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    role: this.fb.control('customer', {
      validators: [Validators.required],
    }),
    avatar: this.fb.control('', {
      validators: [Validators.required],
    }),
  });

  protected readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Update User' : 'Create User'
  );

  constructor() {
    void this.initialize();
  }

  protected get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  protected get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  protected get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  protected get avatarControl(): FormControl<string> {
    return this.form.controls.avatar;
  }

  private async initialize(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.pageReady.set(true);
      return;
    }

    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.pageError.set('Invalid user id.');
      return;
    }

    this.isEditMode.set(true);
    this.userId.set(id);

    const user = await this.usersFacade.getUserById(id);

    if (!user) {
      this.pageError.set('User not found.');
      return;
    }

    this.form.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      avatar: user.avatar,
    });

    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();

    this.pageReady.set(true);
  }

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.usersFacade.isSubmitting()) {
      return;
    }

    if (!this.isEditMode()) {
      const payload: CreateUserDto = {
        name: this.form.controls.name.value.trim(),
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value,
        role: this.form.controls.role.value,
        avatar: this.form.controls.avatar.value.trim(),
      };

      const result = await this.usersFacade.createUser(payload);

      if (result) {
        await this.router.navigateByUrl('/users');
      }

      return;
    }

    const id = this.userId();

    if (!id) {
      return;
    }

    const payload: UpdateUserDto = {
      name: this.form.controls.name.value.trim(),
      email: this.form.controls.email.value.trim(),
      role: this.form.controls.role.value,
      avatar: this.form.controls.avatar.value.trim(),
    };

    const password = this.form.controls.password.value.trim();

    if (password) {
      payload.password = password;
    }

    const result = await this.usersFacade.updateUser(id, payload);

    if (result) {
      await this.router.navigateByUrl('/users');
    }
  }

  protected async onCancel(): Promise<void> {
    await this.router.navigateByUrl('/users');
  }
}
