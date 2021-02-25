import { Product } from './models/product.model';

export const blankProduct = new Product({
  id: '',
  name: '',
  description: '',
  isArchived: false,
});

export const invalidProduct = new Product({
  id: '1',
  name: 'some very long name'.repeat(50),
  description: 'some very long description'.repeat(50),
  isArchived: false,
});

export const validProduct = new Product({
  id: '1',
  name: 'test name',
  description: 'test description',
  isArchived: false,
});
