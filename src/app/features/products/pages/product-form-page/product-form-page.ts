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
import { ProductsFacade } from '../../facades/products.facade';
import { CreateProductDto } from '../../models/create-product.dto';
import { UpdateProductDto } from '../../models/update-product.dto';

type ProductFormGroup = FormGroup<{
  title: FormControl<string>;
  price: FormControl<number>;
  description: FormControl<string>;
  categoryId: FormControl<number>;
  image1: FormControl<string>;
  image2: FormControl<string>;
  image3: FormControl<string>;
}>;

@Component({
  selector: 'app-product-form-page',
  imports: [ReactiveFormsModule, ...UI_PRIMENG],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.scss',
})
export class ProductFormPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly productsFacade = inject(ProductsFacade);
  protected readonly isEditMode = signal(false);
  protected readonly productId = signal<number | null>(null);
  protected readonly pageReady = signal(false);
  protected readonly pageError = signal<string | null>(null);

  protected readonly form: ProductFormGroup = this.fb.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    price: this.fb.control(0, {
      validators: [Validators.required, Validators.min(1)],
    }),
    description: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    categoryId: this.fb.control(1, {
      validators: [Validators.required, Validators.min(1)],
    }),
    image1: this.fb.control('', {
      validators: [Validators.required],
    }),
    image2: this.fb.control(''),
    image3: this.fb.control(''),
  });

  protected readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Update Product' : 'Create Product'
  );

  constructor() {
    void this.initialize();
  }

  protected get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  protected get priceControl(): FormControl<number> {
    return this.form.controls.price;
  }

  protected get descriptionControl(): FormControl<string> {
    return this.form.controls.description;
  }

  protected get categoryIdControl(): FormControl<number> {
    return this.form.controls.categoryId;
  }

  protected get image1Control(): FormControl<string> {
    return this.form.controls.image1;
  }

  private async initialize(): Promise<void> {
    await this.productsFacade.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.pageReady.set(true);
      return;
    }

    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.pageError.set('Invalid product id.');
      return;
    }

    this.isEditMode.set(true);
    this.productId.set(id);

    const product = await this.productsFacade.getProductById(id);

    if (!product) {
      this.pageError.set('Product not found.');
      return;
    }

    this.form.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category.id,
      image1: product.images[0] || '',
      image2: product.images[1] || '',
      image3: product.images[2] || '',
    });

    this.pageReady.set(true);
  }

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.productsFacade.isSubmitting()) {
      return;
    }

    const images = [
      this.form.controls.image1.value,
      this.form.controls.image2.value,
      this.form.controls.image3.value,
    ].filter((image) => !!image?.trim());

    if (!this.isEditMode()) {
      const payload: CreateProductDto = {
        title: this.form.controls.title.value.trim(),
        price: this.form.controls.price.value,
        description: this.form.controls.description.value.trim(),
        categoryId: this.form.controls.categoryId.value,
        images,
      };

      const result = await this.productsFacade.createProduct(payload);

      if (result) {
        await this.router.navigateByUrl('/products');
      }

      return;
    }

    const productId = this.productId();

    if (!productId) {
      return;
    }

    const payload: UpdateProductDto = {
      title: this.form.controls.title.value.trim(),
      price: this.form.controls.price.value,
      description: this.form.controls.description.value.trim(),
      categoryId: this.form.controls.categoryId.value,
      images,
    };

    const result = await this.productsFacade.updateProduct(productId, payload);

    if (result) {
      await this.router.navigateByUrl('/products');
    }
  }

  protected async onCancel(): Promise<void> {
    await this.router.navigateByUrl('/products');
  }
}
