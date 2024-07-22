import { Component, inject } from '@angular/core';
import { SearchInputComponent } from "../../components/inputs/search-input/search-input.component";
import { TableComponent } from "../../components/table/table.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ProductFormComponent } from "../../components/forms/product-form/product-form.component";
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/IProduct';
import { AlertComponent } from "../../components/alert/alert/alert.component";
import { EMPTY_PRODUCT } from '../../utils';
import { Response } from '../../interfaces/IResponse';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [SearchInputComponent, TableComponent, ModalComponent, ProductFormComponent, AlertComponent, RouterLink,
    RouterLinkActive,],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  productsService = inject(ProductsService)
  messageAlert = ''
  product = EMPTY_PRODUCT
  onSubmitCreate(newProduct: Product) {
    this.productsService.createProduct(newProduct).subscribe((resp: Response) => {
      this.messageAlert = resp.message
    })
  }
}
