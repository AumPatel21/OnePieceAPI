import express from 'express';
import { getCharacters, getCharacterById, updateCharacter, deleteCharacter, createCharacter } from '../controllers/characterController.js';
import validate from '../middleware/validate.js';
import { characterQuerySchema, createCharacterSchema, updateCharacterSchema } from '../schemas/characterSchemas.js';
import authAdmin from '../utils/authUtils.js';

const characterRouter = express.Router();

characterRouter.get('/', validate(characterQuerySchema), getCharacters);
characterRouter.get('/:id', validate(characterQuerySchema), getCharacterById);

characterRouter.post("/", authAdmin, validate(createCharacterSchema), createCharacter)
characterRouter.put('/:id', authAdmin, validate(updateCharacterSchema), updateCharacter);
characterRouter.delete('/:id', authAdmin, deleteCharacter);

export default characterRouter;
