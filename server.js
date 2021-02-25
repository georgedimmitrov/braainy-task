const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3080;
const BillyClient = require('./billy-client');

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/my-app/dist/angular-nodejs-example/'));

app.get('/', (req, res) => {
  res.sendFile(
    process.cwd() + '/my-app/dist/angular-nodejs-example/index.html'
  );
});

// error handler ?
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

// Contacts routes

// all contacts
app.get('/api/contacts', async (req, res) => {
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const contacts = await getContacts(client);
  res.json(contacts);
});

// add new contact
app.post('/api/contacts/add-contact', async (req, res, next) => {
  const contactDetails = req.body;
  console.log('contact to create: ' + contactDetails);
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const currentOrganizationId = await getOrganizationId(client);
  const newContact = {
    organizationId: currentOrganizationId,
    name: contactDetails.name,
    countryId: contactDetails.countryId,
    type: contactDetails.type,
  };
  const newContactId = await createContact(client, newContact, next);
  res.json(newContactId);
});

// update existing contact
app.put('/api/contacts/update-contact/:id', async (req, res) => {
  const contactId = req.params.id;
  const contactDetails = req.body;
  console.log('contact to update: ' + contactDetails);
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const currentOrganizationId = await getOrganizationId(client);
  const contact = {
    organizationId: currentOrganizationId,
    name: contactDetails.name,
    countryId: contactDetails.countryId,
    type: contactDetails.type,
  };
  const updatedContact = await updateContact(client, contactId, contact);
  res.json(updatedContact);
});

// get single contact
app.get('/api/contacts/contact/:id', async (req, res) => {
  const contactId = req.params.id;

  console.log('contact to create: ' + contact);
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const contactFromDb = getContact(client, contactId);
  res.json(contactFromDb);
});

// Products Routes

// get all
app.get('/api/products', async (req, res) => {
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const products = await getProducts(client);
  res.json(products);
});

// add new product
app.post('/api/products/add-product', async (req, res, next) => {
  const productDetails = req.body;
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const currentOrganizationId = await getOrganizationId(client);
  const newProduct = {
    organizationId: currentOrganizationId,
    name: productDetails.name,
    description: productDetails.description,
    isArchived: productDetails.isArchived,
  };
  const dbProduct = await createProduct(client, newProduct, next);
  res.json(dbProduct);
});

// update existing product
app.put('/api/products/update-product/:id', async (req, res) => {
  const productId = req.params.id;
  const productDetails = req.body;
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const currentOrganizationId = await getOrganizationId(client);
  const product = {
    organizationId: currentOrganizationId,
    name: productDetails.name,
    description: productDetails.description,
    isArchived: productDetails.isArchived,
  };
  const updatedProduct = await updateProduct(client, productId, product);
  res.json(updatedProduct);
});

// Creates a contact. The server replies with a list of contacts and we
// return the id of the first contact of the list
async function createContact(client, contact) {
  const res = await client.request('POST', '/contacts', { contact: contact });

  return res.contacts[0];
}

async function updateContact(client, contactId, contact) {
  const res = await client.request('PUT', '/contacts/' + contactId, {
    contact: contact,
  });

  return res.contacts[0];
}

// Creates a product. The server replies with a list of contacts and we
// return the id of the first contact of the list
async function createProduct(client, product) {
  const res = await client.request('POST', '/products', { product: product });

  return res.products[0];
}

async function updateProduct(client, productId, product) {
  const res = await client.request('PUT', '/products/' + productId, {
    product: product,
  });

  return res.products[0];
}

// Gets the id of organization associated with the API token.
async function getOrganizationId(client) {
  const res = await client.request('GET', '/organization');

  return res.organization.id;
}

// async function getInvoice(client, invoiceId) {
//   const res = await client.request('GET', '/invoices', invoiceId);

//   return res.invoices[0];
// }

async function getContact(client, contactId) {
  const res = await client.request('GET', '/contacts', contactId);

  return res.contacts[0];
}

async function getContacts(client) {
  const res = await client.request('GET', '/contacts');

  return res;
}

async function getProducts(client) {
  const res = await client.request('GET', '/products');

  return res;
}
