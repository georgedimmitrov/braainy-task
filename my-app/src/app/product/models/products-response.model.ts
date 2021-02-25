import { BillyMetaResponse } from 'src/app/contact/models/billy-meta-response.model';
import { Product } from './product.model';

export class ProductsResponse {
  products: Product[];
  meta: BillyMetaResponse;
}
