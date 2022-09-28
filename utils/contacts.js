const fs = require('fs');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Membuar file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// 
const loadContacts = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const findContact = (name) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  return contact;
}

const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
}

const checkDuplicate = (contactName) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.name === contactName);
  return contact;
}

const deleteContact = (contactName) => {
  const contacts = loadContacts();
  const filteredContact = contacts.filter((contact) => contact.name !== contactName);
  saveContacts(filteredContact);
}

const updateContacts = (newContact) => {
  const contacts = loadContacts();
  // * hilangkan oldContact yang namanya sama dengan oldName 
  const filteredContact = contacts.filter(contact => contact.name !== newContact.oldName);
  delete newContact.oldName;
  filteredContact.push(newContact);
  saveContacts(filteredContact);
}

module.exports = { loadContacts, findContact, addContact, checkDuplicate, deleteContact, updateContacts }
