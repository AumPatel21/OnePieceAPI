import express from 'express';
import getDevilFruits from '../controllers/devilFruitController.js';

const devilFruitRouter = express.Router();

devilFruitRouter.get('/', getDevilFruits);

export default devilFruitRouter;
