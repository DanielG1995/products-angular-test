import { Product } from "./IProduct";

export interface Response {
    message: string,
    data: Product[]
}

export interface ResponseProduct {
    message: string,
    data: Product
}