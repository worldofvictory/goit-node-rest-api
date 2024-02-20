import { HttpError, catchAsync } from "../helpers/index.js";
import { Contact } from "../models/contacts.js";


export const getAllContacts = catchAsync(async (req, res) => {
    try {
         const { _id: owner } = req.user;
        const { page = 1, limit = 20, favorite } = req.query;
        const skip = (page - 1) * limit;

  const isFavorite = favorite === "true";
        const contacts = await Contact.find(
            { owner, favorite: isFavorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
        ).populate("owner", "email");; 
        
        res.json(contacts); 
    } catch (error) {
        next(error)
}
});

export const getOneContact = catchAsync(async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const contact = await Contact.findById(id).where("owner").equals(owner);
       if (!contact)  {
        throw HttpError(404);
    }
           
   res.json(contact);
    } catch (error) {
        next(error)
    }
});

        
       
  

export const deleteContact = catchAsync(async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const deleteContact = await Contact.findByIdAndDelete(id).where("owner")
    .equals(owner);

        if (!deleteContact) {
            
        throw HttpError(404); 
    } 
      res.json(deleteContact);
    } catch (error) {
        next(error) 
    }
});

export const createContact = catchAsync(async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { name, email, phone } = req.body;
        const newContact = await Contact.create({...req.body, owner });
        if (newContact) {
            res.status(201).json(newContact);
        } else {
            throw new HttpError(400, error.message);
        }
    } catch (error) {
        next(error)
    }
});




export const updateContact = catchAsync(async (req, res, next) => {
    try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
        res.status(400).json({ "message": "Body must have at least one field" });
    }

        const changeContact = await Contact.findByIdAndUpdate(id, req.body, { new: true })
    .where("owner").equals(owner);
    if (changeContact) {
        res.status(200).json(changeContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
});

export const updateStatusContact = catchAsync(async (req, res, next) => {
    try {
         const { _id: owner } = req.user;
        const { id } = req.params;
        const data = req.body;
        const favoriteContact = await Contact.findByIdAndUpdate(id, req.body, { new: true })
     .where("owner").equals(owner);

    if (favoriteContact) {
        res.status(200).json(favoriteContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
})