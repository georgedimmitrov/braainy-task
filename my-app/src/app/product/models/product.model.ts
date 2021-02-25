export class Product {
  id: string;
  name: string;
  description: string;
  accountId: string;
  imageId: string;
  imageUrl: string;
  inventoryAccountId: string;
  isArchived: boolean;
  isInInventory: boolean;
  organizationId: string;
  productNo: string;
  salesTaxRulesetId: string;
  suppliersProductNo: string;

  constructor(product?: Partial<Product>) {
    if (product) {
      this.id = product.id;
      this.name = product.name;
      this.description = product.description;
      this.productNo = product.productNo;
      this.isArchived = product.isArchived;
    }
  }
}
