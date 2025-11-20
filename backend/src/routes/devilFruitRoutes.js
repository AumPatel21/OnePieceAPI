import express from 'express';
import { getDevilFruits, getDevilFruitbyId } from '../controllers/devilFruitController.js';
import validate from '../middleware/validate.js';
import dfQuerySchema from '../schemas/dfSchemas.js';

const devilFruitRouter = express.Router();

devilFruitRouter.get('/', validate(dfQuerySchema), getDevilFruits);
devilFruitRouter.get("/:id", validate(dfQuerySchema), getDevilFruitbyId);

export default devilFruitRouter;
