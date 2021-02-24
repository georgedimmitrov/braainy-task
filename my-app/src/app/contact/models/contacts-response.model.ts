import { BillyMetaResponse } from './billy-meta-response.model';
import { Contact } from './contact.model';

export class ContactsResponse {
  contacts: Contact[];
  meta: BillyMetaResponse;
}
