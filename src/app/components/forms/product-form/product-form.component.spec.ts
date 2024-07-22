import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Product } from '../../../interfaces/IProduct';
import { EMPTY_PRODUCT } from '../../../utils';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ProductsService } from '../../../services/products.service';
import { dateComparisonValidator } from '../../../validators/dateComparisonValidator';
import { idValidator } from '../../../validators/idValidator';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let debugElement: DebugElement;
  let mockProductService: jasmine.SpyObj<ProductsService>;

  const mockProduct: Product = {
    id: 'uno',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'logo.png',
    date_release: '2024-07-30',
    date_revision: '2025-07-30'
  };

  beforeEach(() => {
    // Create a mock ProductsService
    mockProductService = jasmine.createSpyObj('ProductsService', ['']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductsService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    // Set initial product and disabledInputs
    component.product = mockProduct;
    component.disabledInputs = ['id'];
    component.ngOnChanges({
      product: {
        currentValue: mockProduct,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      },
      disabledInputs: {
        currentValue: ['id'],
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia inicializar los campos', () => {
    const formValues = component.productForm.value;
    expect(formValues.name).toBe(mockProduct.name);
    expect(formValues.description).toBe(mockProduct.description);
    expect(formValues.logo).toBe(mockProduct.logo);
    // expect(formValues.date_release).toBe(mockProduct.date_release);
    // expect(formValues.date_revision).toBe(mockProduct.date_revision);
  });

  it('Deberia deshabilitar campos especificos', () => {
    expect(component.productForm.get('id')?.disabled).toBeTrue();
    expect(component.productForm.get('name')?.enabled).toBeTrue();
  });

  it('Deberia validar campos requeridos', () => {
    component.productForm.get('name')?.setValue('');
    component.productForm.get('description')?.setValue('');
    component.productForm.get('logo')?.setValue('');

    component.onSubmit();
    fixture.detectChanges();

    const errors = debugElement.queryAll(By.css('.error'));
    expect(errors.length).toBe(3); 
  });

  it('Deberia hacer el submit de formulario', () => {
    spyOn(component.submitEvent, 'emit');
    component.productForm.setValue({
      id: '124',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated_logo.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.submitEvent.emit).toHaveBeenCalledWith(component.productForm.value);
  });

  it('Deberia resetear campos correctamente', () => {
    component.resetForm();
    fixture.detectChanges();

    const formValues = component.productForm.value;
    expect(formValues.name).toBe(null)
    
  });

  it('should call updateDate method and set the correct value', () => {
    const dateInput = component.productForm.get('date_release');
    if (dateInput) {
      dateInput.setValue('2024-01-01');
      component.updateDate('date_release', 'date_revision');
      fixture.detectChanges();

      const dateRevision = component.productForm.get('date_revision')?.value;
      expect(dateRevision).toBe('2025-01-01');
    }
  });

  it('should handle field errors correctly', () => {
    component.productForm.get('description')?.setValue('');
    component.productForm.get('name')?.setValue('shrt');
    
    const idError = component.getFieldError('description');
    const nameError = component.getFieldError('name');
    
    fixture.detectChanges();
    expect(idError).toBe('Este campo es requerido');
    expect(nameError).toBe('Mínimo 6 caracteres.');
  });
});
