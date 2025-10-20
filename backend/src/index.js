import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';
import prisma from './utils/db.js';
import characterRouter from './routes/characterRoutes.js';
import devilFruitRouter from './routes/devilFruitRoutes.js';

/*
working get requests:
http://localhost:3000/characters
http://localhost:3000/characters?page=2&limit=20
http://localhost:3000/characters?bounty_gte=1000000000
http://localhost:3000/characters?devil_fruit=Gomu
http://localhost:3000/characters?affiliation=Straw%20Hat
http://localhost:3000/devil-fruits?type=Zoan
*/

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
app.use('/characters', characterRouter);
app.use('/devil-fruits', devilFruitRouter);



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
