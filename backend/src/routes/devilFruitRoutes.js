import express from 'express';
import { getDevilFruits } from '../controllers/devilFruitController.js';

const router = express.Router();

router.get('/', getDevilFruits);

export default router;
