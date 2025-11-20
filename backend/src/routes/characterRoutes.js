import express from 'express';
import { getCharacters, getCharacterById } from '../controllers/characterController.js';
import validate from '../middleware/validate.js';
import characterQuerySchema from '../schemas/characterSchemas.js';

const characterRouter = express.Router();

characterRouter.get('/', validate(characterQuerySchema), getCharacters);
characterRouter.get('/:id', validate(characterQuerySchema), getCharacterById);

export default characterRouter;
