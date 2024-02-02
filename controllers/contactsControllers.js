
import { listContacts, addContact, getContactById, removeContact } from "../services/contactsServices.js";

import { createContactSchema }   from '../schemas/contactsSchemas.js';

import { HttpError } from "../helpers/HttpError.js";
import { updateContactSchema } from '../schemas/contactsSchemas.js';
import { Contact } from "../models/contacts.js";





export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find(); 
        res.status(200).json(contacts); // Повертаємо масив контактів у форматі JSON зі статусом 200
    } catch (err) {
        res.status(500).json({ message: err.message, contacts }); // В разі помилки повертаємо відповідну помилку у JSON зі статусом 500
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
       if (!contact)  {
        throw HttpError(404);
    }
           
         else {
            res.status(200).json(contact); 
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
        const deleteContact = await Contact.findByIdAndDelete(id)

        if (!deleteContact) {
            {
        throw HttpError(404); 
    } 
        } else {
          res.status(200).json(deleteContact);  
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
        const newContact = await Contact.create({ name, email, phone });  
        res.status(201).json(newContact);
    } catch (error) {
        next(error);  
    }
};




export const updateContact = async (req, res, next) => {
    try {
    const { id } = req.params;
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
        res.status(400).json({ "message": "Body must have at least one field" });
    }

    const changeContact = await Contact.findByIdAndUpdate(id, data);
    if (changeContact) {
        res.status(200).json(changeContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const favoriteContact = await Contact.findByIdAndUpdate(id, data, { new: true });

    if (favoriteContact) {
        res.status(200).json(favoriteContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
}
