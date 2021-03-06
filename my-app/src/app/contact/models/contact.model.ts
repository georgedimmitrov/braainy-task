export class Contact {
  id: string;
  name: string;
  organizationId: string;
  phone: string;
  accessCode: string;
  cityId: string;
  cityText: string;
  contactNo: string;
  countryId: string;
  createdTime: string;
  type: string;
  fax: string;
  isArchived: boolean;
  isCustomer: boolean;
  isSalesTaxExempt: boolean;
  isSupplier: boolean;
  registrationNo: string;
  stateText: string;
  street: string;
  zipcodeId: string;
  zipcodeText: string;

  constructor(contact?: Partial<Contact>) {
    if (contact) {
      this.id = contact.id;
      this.name = contact.name;
      this.countryId = contact.countryId;
      this.type = contact.type;
      this.createdTime = contact.createdTime;
    }
  }
}

export const availableCountryCodes: string[] = ['BG', 'CA', 'DK'];
