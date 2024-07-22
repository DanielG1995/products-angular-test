import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink, RouterLinkActive } from '@angular/router';
import { Product } from '../../interfaces/IProduct';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from "../../components/forms/product-form/product-form.component";
import { AlertComponent } from "../../components/alert/alert/alert.component";

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, AlertComponent, RouterLink,
    RouterLinkActive],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  #route = inject(ActivatedRoute)
  #productService = inject(ProductsService)
  disabledInputs = ['id']
  currentId: string | null = null
  product: Product | null = null
  message: string = ''
  constructor() {
    this.#route.paramMap.subscribe((params: ParamMap) => {
      this.currentId = params.get('id');
    });
  }

  ngOnInit() {
    if (this.currentId) {
      this.#productService.getProductByid(this.currentId).subscribe(resp => {
        this.product = resp
      })
    }
  }

  onSubmitUpdate(values: Omit<Product, 'id'>) {

    this.#productService.updateProduct({ id: this.currentId!, ...values }).subscribe(resp => {
      this.message = resp.message
    })
  }





}
