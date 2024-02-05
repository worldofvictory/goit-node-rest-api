import { nanoid } from "nanoid";
import { listContacts, addContact, getContactById, removeContact } from "../services/contactsServices.js";
import { promises as fs } from "fs";
import { createContactSchema }   from '../schemas/contactsSchemas.js';
import { validateBody } from '../helpers/validateBody.js';
import HttpError from "../helpers/HttpError.js";
import { updateContactSchema } from '../schemas/contactsSchemas.js'





export const getAllContacts = async (req, res) => {
    try {
        const contacts = await listContacts(); 
        res.status(200).json(contacts); // Повертаємо масив контактів у форматі JSON зі статусом 200
    } catch (err) {
        res.status(500).json({ message: err.message, contacts }); // В разі помилки повертаємо відповідну помилку у JSON зі статусом 500
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } 
    catch (error) { 
        res.status(500).json({ message: error.message });
    } 
}; 
        
       
  

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Викликаємо функцію removeContact для видалення контакту за id
        const deleteContact = await removeContact(id)

        if (deleteContact) {
            res.status(200).json(deleteContact);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createContact = async (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body)
        if (error) {
            throw HttpError(400);
        }
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);  
        res.status(201).json(newContact);
    } catch (error) {
        next(error);  
    }
};




export const updateContact = async (req, res) => {
  try {
    // Валідація отриманих даних відповідно до схеми updateContactSchema
    const { error, value } = updateContactSchema.validate(req.body);
    
    if (error) {
      // Відправлення статусу 400 та повідомлення про помилку у випадку невалідних даних
      return res.status(400).json({ message: error.message });
    }

    // Останній об’єкт контакту в масиві contacts з вказаним id
    const contactsDB = await fs.readFile('./db/contacts.json');
    const contacts = JSON.parse(contactsDB);
    const { name, email, phone } = value;
    const { id } = req.params;
    const contactIndex = contacts.findIndex((item) => item.id === id);

    if (contactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    const contact = contacts[contactIndex];
    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;

    // Збереження змін до файлу contacts.json
    await fs.writeFile('./db/contacts.json', JSON.stringify(contacts, null, 2));

    // Відправлення відповіді про оновлений контакт
    res.status(200).json(contact);
  } catch (err) {
    // Обробка будь-яких помилок та відправлення відповіді з відповідним статусом
    res.status(500).json({ message: err.message });
  }
};
