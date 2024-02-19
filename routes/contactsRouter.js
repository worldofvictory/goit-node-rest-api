import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { validateBody } from "../helpers/validateBody.js"
import { validId } from "../helpers/validId.js"
import { autenticate } from "../helpers/autenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", autenticate, getAllContacts);

contactsRouter.get("/:id", autenticate, validId, getOneContact);

contactsRouter.delete("/:id", autenticate, validId, deleteContact);

contactsRouter.post("/", autenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", autenticate, validateBody(updateContactSchema), validId, updateContact);

contactsRouter.patch("/:id/favorite", autenticate, validateBody(updateContactSchema), validId, updateStatusContact);

export default contactsRouter;
