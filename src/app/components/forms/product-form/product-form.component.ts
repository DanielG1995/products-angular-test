import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/IProduct';
import { EMPTY_PRODUCT } from '../../../utils';
import { dateComparisonValidator } from '../../../validators/dateComparisonValidator';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product = EMPTY_PRODUCT;
  @Input() disabledInputs?: string[]
  @Output() submitEvent = new EventEmitter<any>();
  productForm: FormGroup = this.fb.group({});;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    }), { validators: dateComparisonValidator() };

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && changes['product'].currentValue) {
      this.updateForm(changes['product'].currentValue);
    }

    if (changes['disabledInputs']) {
      this.disabledInputs?.forEach(input => {
        console.log(input)
        this.productForm.get(input)?.disable();
      })
    }
  }

  updateForm(product: any) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: new Date(product.date_release).toLocaleDateString('en-CA'),
      date_revision: new Date(product.date_revision).toLocaleDateString('en-CA'),
    });
  }


  onSubmit() {
    console.log('emit', this.productForm.valid)
    if (this.productForm.valid) {
      this.submitEvent.emit(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean | undefined {
    const field = this.productForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  isDisabled(name: string) {
    console.log(this.disabledInputs?.includes(name) || false)
    return this.disabledInputs?.includes(name) || false
  }

  getFieldError(field: string): string | null {

    if (!this.productForm.controls[field]) return null;

    const errors = this.productForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Campo obligatorio';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
      }
    }
    if (this.productForm.errors?.['dateComparison']) {
      return this.productForm.errors['dateComparison'];
    }

    return null;
  }

  resetForm() {
    this.productForm.reset()
  }
}
