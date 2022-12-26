const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("./db/contacts.json");

async function readContacts() {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf8"));
    return contacts;
  } catch (error) {
    console.log(error);
  }
}

async function writeContacts(value) {
  try {
    const contacts = await fs.writeFile(
      contactsPath,
      JSON.stringify(value, null, 4)
    );
    return contacts;
  } catch (error) {
    console.log(error);
  }
}

async function listContacts() {
  try {
    const contacts = await readContacts();
    console.table(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const result = await contacts.find(({ id }) => id === String(contactId));
    !result
      ? console.log("Not found the contact! Please try again!")
      : console.table(result);

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const contactsDev = [...contacts];
    const contactToBeDeleted = await contactsDev.findIndex(
      ({ id }) => String(contactId) === id
    );
    if (contactToBeDeleted === -1) {
      console.log("Such a contact does not exist!");
    }
    await contactsDev.splice(contactToBeDeleted, 1);
    await writeContacts(contactsDev);
    console.table(await readContacts());
    return;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const id = nanoid();

    const newContact = {
      name,
      email,
      phone,
      id,
    };

    const newContactArr = [...contacts, newContact];
    await writeContacts(newContactArr);
    console.table(await readContacts());
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
