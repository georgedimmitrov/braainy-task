const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3080;
const BillyClient = require('./billy-client');

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/my-app/dist/angular-nodejs-example/'));

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
app.get('/api/products', async (req, res) => {
  const client = new BillyClient('749f6c0f873eb98f16257eec9baa47c944617d34');
  const products = await getProducts(client);
  res.json(products);
});

app.get('/', (req, res) => {
  res.sendFile(
    process.cwd() + '/my-app/dist/angular-nodejs-example/index.html'
  );
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
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

// Creates a product. The server replies with a list of products and we
// return the id of the first product of the list
async function createProduct(client, organizationId) {
  const product = {
    organizationId: organizationId,
    name: 'Ninjas',
    prices: [
      {
        unitPrice: 200,
        currencyId: 'DKK',
      },
    ],
  };
  const res = await client.request('POST', '/products', { product: product });

  return res.products[0].id;
}

// Creates an invoice, the server replies with a list of invoices and we
// return the id of the first invoice of the list
async function createInvoice(client, organizationId, contactId, productId) {
  const invoice = {
    organizationId: organizationId,
    invoiceNo: 5003,
    entryDate: '2013-11-14',
    contactId: contactId,
    lines: [
      {
        productId: productId,
        unitPrice: 200,
      },
    ],
  };
  const res = await client.request('POST', '/invoices', { invoice: invoice });

  return res.invoices[0].id;
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

// error handler ?
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
