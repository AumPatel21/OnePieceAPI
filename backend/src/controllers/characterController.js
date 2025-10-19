/*
TODO check if example links work
works:
http://localhost:3000/characters
http://localhost:3000/characters?page=2&limit=20

*/

import { skip } from '@prisma/client/runtime/library';
import prisma from '../utils/db.js'

const getCharacters = async (req, res) => {
    try {
        const { affiliation, bounty_gte, devil_fruit, page = 1, limit = 10 } = req.query;
        const filters = {}

        if (affiliation) filters.affiliation = { contains: affiliation, mode: 'insensitive' };
        if (bounty_gte) filters.affiliation = { gte: parseInt(bounty) }
        if (devil_fruit) filters.devil_fruit = { contains: devil_fruit, mode: 'insensitive' };

        const characters = await prisma.characters.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: parseInt(limit),
            orderBy: { id: 'asc' },
        });

        const total = await prisma.characters.count({ where: filters });

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            data: characters,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
};

export default getCharacters;
