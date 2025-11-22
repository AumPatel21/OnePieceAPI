import express from 'express';
import { getDevilFruits, getDevilFruitbyId, updateDevilFruit, deleteDevilFruit } from '../controllers/devilFruitController.js';
import validate from '../middleware/validate.js';
import { dfQuerySchema, updateDfSchema } from '../schemas/dfSchemas.js';
import { deleteCharacter } from '../controllers/characterController.js';

const devilFruitRouter = express.Router();

devilFruitRouter.get('/', validate(dfQuerySchema), getDevilFruits);
devilFruitRouter.get("/:id", validate(dfQuerySchema), getDevilFruitbyId);

devilFruitRouter.put('/:id', validate(updateDfSchema), updateDevilFruit);

devilFruitRouter.delete('/:id', deleteDevilFruit)

export default devilFruitRouter;
