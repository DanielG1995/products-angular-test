import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/IProduct';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Response } from '../interfaces/IResponse';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  #products = signal<Product[]>([])
  #allProducts: Product[] = []
  public currentProducts = computed(() => this.#products())
  #http = inject(HttpClient)

  constructor() {
    this.loadData();

  }

  loadData() {
    this.#http.get<any>(`${environment.apiUrl}bp/products`).subscribe(resp => {
      this.#products.set(resp.data)
      this.#allProducts = resp.data

    });
  }


  filterProducts = (value: string) => {
    this.#products.set(this.#allProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase())));
  }

  getProductByid(id: string) {
    return this.#http.get<any>(`${environment.apiUrl}bp/products/${id}`).pipe(
      catchError(error => {
        return of(error.error);
      }))
  }

  createProduct(product: Product) {
    return this.#http.post<any>(`${environment.apiUrl}bp/products`, { ...product }).pipe(
      tap((resp: Response) => {
        this.#products.update(prev => ([{ ...resp.data }, ...prev]))
        this.#allProducts.unshift(resp.data)
      }),
      catchError(error => {
        return of(error.error);
      })
    )
  }

  updateProduct(product: Product) {
    const { id, ...rest } = product
    console.log(product);
    return this.#http.put<any>(`${environment.apiUrl}bp/products/${id}`, { ...rest }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  deleteProduct(id: string) {
    return this.#http.delete<any>(`${environment.apiUrl}bp/products/${id}`).pipe(
      catchError(error => {
        return of(error.error);
      }),
      tap(() => {
        this.#products.update(prev => ([...prev.filter(p => p.id !== id)]))
        this.#allProducts = this.#allProducts.filter(p => p.id !== id)
      })
    )
  }

}
