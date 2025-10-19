import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';
import prisma from './utils/db.js';
import getCharacters from './controllers/characterController.js';
import getDevilFruits from './controllers/devilFruitController.js';

// load environment variables
dotenv.config()


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("One Piece API backend is running ⚓");
});

// routes
app.use('/', getCharacters)
app.use('/', getDevilFruits)


// app.get("/test-db", async (req, res) => {
//     try {
//         const characters = await prisma.character.findMany({ take: 5 });
//         res.json(characters);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Database Connection failed! ❌" })
//     }
// });

app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));
