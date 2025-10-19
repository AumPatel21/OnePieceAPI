import express from 'express';
import { getCharacters } from '../controllers/characterController.js';

const router = express.Router();

router.get('/', getCharacters);

export default router;
