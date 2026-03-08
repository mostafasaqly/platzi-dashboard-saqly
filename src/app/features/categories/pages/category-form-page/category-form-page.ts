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
import { CategoriesFacade } from '../../facades/categories.facade';
import { CreateCategoryDto } from '../../models/create-category.dto';
import { UpdateCategoryDto } from '../../models/update-category.dto';

type CategoryFormGroup = FormGroup<{
  name: FormControl<string>;
  image: FormControl<string>;
}>;

@Component({
  selector: 'app-category-form-page',
  imports: [ReactiveFormsModule, ...UI_PRIMENG],
  templateUrl: './category-form-page.html',
  styleUrl: './category-form-page.scss',
})
export class CategoryFormPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categoriesFacade = inject(CategoriesFacade);
  protected readonly isEditMode = signal(false);
  protected readonly categoryId = signal<number | null>(null);
  protected readonly pageReady = signal(false);
  protected readonly pageError = signal<string | null>(null);

  protected readonly form: CategoryFormGroup = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    image: this.fb.control('', {
      validators: [Validators.required],
    }),
  });

  protected readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Update Category' : 'Create Category'
  );

  constructor() {
    void this.initialize();
  }

  protected get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  protected get imageControl(): FormControl<string> {
    return this.form.controls.image;
  }

  private async initialize(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.pageReady.set(true);
      return;
    }

    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.pageError.set('Invalid category id.');
      return;
    }

    this.isEditMode.set(true);
    this.categoryId.set(id);

    const category = await this.categoriesFacade.getCategoryById(id);

    if (!category) {
      this.pageError.set('Category not found.');
      return;
    }

    this.form.patchValue({
      name: category.name,
      image: category.image,
    });

    this.pageReady.set(true);
  }

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.categoriesFacade.isSubmitting()) {
      return;
    }

    if (!this.isEditMode()) {
      const payload: CreateCategoryDto = {
        name: this.form.controls.name.value.trim(),
        image: this.form.controls.image.value.trim(),
      };

      const result = await this.categoriesFacade.createCategory(payload);

      if (result) {
        await this.router.navigateByUrl('/categories');
      }

      return;
    }

    const id = this.categoryId();

    if (!id) {
      return;
    }

    const payload: UpdateCategoryDto = {
      name: this.form.controls.name.value.trim(),
      image: this.form.controls.image.value.trim(),
    };

    const result = await this.categoriesFacade.updateCategory(id, payload);

    if (result) {
      await this.router.navigateByUrl('/categories');
    }
  }

  protected async onCancel(): Promise<void> {
    await this.router.navigateByUrl('/categories');
  }
}
