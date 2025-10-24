import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';
import characterRouter from './routes/characterRoutes.js';
import devilFruitRouter from './routes/devilFruitRoutes.js';

/*
Example tests:
-----Characters-----
http://localhost:3000/characters
http://localhost:3000/characters?name=luffy
http://localhost:3000/characters?affiliation=straw%20hat
http://localhost:3000/characters?occupation=pirate

http://localhost:3000/characters?status=alive


http://localhost:3000/characters?page=2&limit=5
http://localhost:3000/characters?sort=bounty&order=desc
http://localhost:3000/characters?sort=bounty&order=asc
http://localhost:3000/characters?sort=name&order=asc
http://localhost:3000/characters?name=zoro&affiliation=straw%20hat&occupation=swordsman&status=alive&sort=bounty&order=desc&page=1&limit=3

-----Devil Fruits-----
http://localhost:3000/devil-fruits
http://localhost:3000/devil-fruits?name=gomu
http://localhost:3000/devil-fruits?type=paramecia
http://localhost:3000/devil-fruits?current_owner=luffy
http://localhost:3000/devil-fruits?previous_owner=ace
http://localhost:3000/devil-fruits?status=canon
http://localhost:3000/devil-fruits?status=non-canon
http://localhost:3000/devil-fruits?sort=name&order=asc
http://localhost:3000/devil-fruits?sort=type&order=desc
http://localhost:3000/devil-fruits?page=2&limit=5
http://localhost:3000/devil-fruits?type=logia&status=canon&sort=name&order=asc
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
