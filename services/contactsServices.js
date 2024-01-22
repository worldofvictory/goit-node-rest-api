import { promises as fs } from "fs";
import { join } from "path";
import { nanoid } from 'nanoid';

const contactsPath = join('db','contacts.json');
 

async function listContacts() {    // ...твій код. Повертає масив контактів.
    try {
        const data = await fs.readFile(contactsPath);
        const dataArr = JSON.parse(data)
        return dataArr;
    }
    catch (err) {
        console.log('err');
         
    }
}

async function getContactById(contactId) {  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
     try {
       const dataArr = await listContacts();
       return dataArr.find((contact) => contact.id === contactId) || null;
        
    }
    catch (err) {
        console.log('err');
    }
   
}

async function removeContact(contactId) {  // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
     try {
 const dataArr = await listContacts();
  const index = dataArr.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = dataArr.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(dataArr, null, 2));
  return result;
    }
    catch (err) {
        console.log('err');
        
    }
  
}

async function addContact(name, email, phone) {
     try {
         const dataArr = await listContacts();
         const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }
         dataArr.push(newContact);
         await fs.writeFile(contactsPath, JSON.stringify(dataArr, null, 2));
         return newContact;
    }
    catch (err) {
         console.log(err);
        
        
    }
  // ...твій код. Повертає об'єкт доданого контакту (з id).
}

export { listContacts, getContactById, removeContact, addContact };