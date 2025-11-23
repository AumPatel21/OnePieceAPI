import express from 'express';
import { getCharacters, getCharacterById, updateCharacter, deleteCharacter, createCharacter } from '../controllers/characterController.js';
import validate from '../middleware/validate.js';
import { characterQuerySchema, createCharacterSchema, updateCharacterSchema } from '../schemas/characterSchemas.js';

const characterRouter = express.Router();

characterRouter.get('/', validate(characterQuerySchema), getCharacters);
characterRouter.get('/:id', validate(characterQuerySchema), getCharacterById);

characterRouter.post("/", validate(createCharacterSchema), createCharacter)

characterRouter.put('/:id', validate(updateCharacterSchema), updateCharacter);

characterRouter.delete('/:id', deleteCharacter);

export default characterRouter;
