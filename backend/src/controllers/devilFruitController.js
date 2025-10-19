import { skip } from '@prisma/client/runtime/library';
import prisma from '../utils/db.js'

const getDevilFruits = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = res.query;
        const filters = {};

        if (type) filters.type = { contains: type, mode: 'insensitive' };

        const devilFruits = await prisma.devil_fruits.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: parseInt(limit),
            orderBy: { id: 'asc' }
        });

        const total = await prisma.devil_fruits.count({ where: filters });

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            data: devilFruits,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
};

export default getDevilFruits;