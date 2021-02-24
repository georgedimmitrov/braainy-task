import { BillyPaging } from './billy-paging.model';

export class BillyMetaResponse {
  paging: BillyPaging;
  statusCode: number;
  success: boolean;
  time: number;
}
