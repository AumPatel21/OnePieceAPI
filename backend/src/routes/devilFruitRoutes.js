import express from 'express';
import { getDevilFruits, getDevilFruitbyId, updateDevilFruit, deleteDevilFruit, createDevilFruit } from '../controllers/devilFruitController.js';
import validate from '../middleware/validate.js';
import { createDevilFruitSchema, dfQuerySchema, updateDfSchema } from '../schemas/dfSchemas.js';

const devilFruitRouter = express.Router();

devilFruitRouter.get('/', validate(dfQuerySchema), getDevilFruits);
devilFruitRouter.get('/:id', validate(dfQuerySchema), getDevilFruitbyId);

devilFruitRouter.post('/', validate(createDevilFruitSchema), createDevilFruit)

devilFruitRouter.put('/:id', validate(updateDfSchema), updateDevilFruit);

devilFruitRouter.delete('/:id', deleteDevilFruit)

export default devilFruitRouter;
