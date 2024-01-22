import { nanoid } from "nanoid";
import { listContacts, getContactById, removeContact, addContact } from "../services/contactsServices.js";
import { promises as fs } from "fs";
import { contactSchema }  from '../schemas/contactsSchemas.js';
import { validateBody } from '../helpers/validateBody.js';
import HttpError from 'http-errors';
import { updateContactSchema } from '../schemas/contactsSchemas.js'

const addContactValidationMiddleware = validateBody(contactSchema);



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
       
        const contactsDB = await getContactById();
        const contacts = JSON.parse(contactsDB);
        const contact = contacts.find(item => item.id === req.params.id)
        res.status(200).json(contact);
    }
    catch (error) {
        res.status(404).json({ message: "Not found" });
    }
};

export const deleteContact = async (req, res) => {
 try {
        const contactsDB = await removeContact();
        const contacts = JSON.parse(contactsDB);
        const { id } = req.params;

        const contactIndex = contacts.findIndex(item => item.id === id);
        if (contactIndex === -1) {
            return res.status(404).json({ message: "Not found" });
        }

    
        const [removedContact] = contacts.splice(contactIndex, 1);

        await fs.writeFile('./db/contacts.json', JSON.stringify(contacts, null, 2));

        res.status(200).json(removedContact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };



export const createContact = [
    addContactValidationMiddleware, async (req, res) => {
        try {
            const { name, email, phone } = req.body;
            if (!name || !email || !phone) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newContact = {
                id: nanoid(),
                name,
                email,
                phone
            };
            //save user in DB
            const contactsDB = await addContact();
            const contacts = JSON.parse(contactsDB); //достаю фізично масив
            contacts.push(newContact); //в масив записала новий контакт
            await fs.writeFile('./db/contacts.json', JSON.stringify(contacts, null, 2)); //повністю переписала файл contacts.json
            res.status(201).json(newContact);
        }
      catch (error) {
      if (error.status) {
        const message = error.message || HttpError(error.status).message;
        res.status(error.status).json({ message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
        }
    }
];

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
