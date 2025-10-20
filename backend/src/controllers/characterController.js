import prisma from '../utils/db.js'

const getCharacters = async (req, res) => {
    try {
        const { affiliation, bounty_gte, devil_fruit, page = 1, limit = 10 } = req.query;
        const filters = {}

        if (affiliation) filters.affiliations = { contains: affiliation, mode: 'insensitive' };
        if (devil_fruit) {
            filters.devil_fruits = {
                name: { contains: devil_fruit, mode: 'insensitive' },
            };
        }

        let characters = await prisma.characters.findMany({
            where: filters,
            include: { devil_fruits: true },
            orderBy: { id: 'asc' },
        });

        if (bounty_gte) {
            const bountyThreshold = parseInt(bounty_gte.replace(/[^0-9]/g, ''));  // remove commas
            characters = characters.filter((ch) => {
                if (!ch.bounty) return false;
                const num = parseInt(ch.bounty.replace(/[^0-9]/g, '')); // remove commas
                return num >= bountyThreshold;
            });
        }

        const total = characters.length;
        const start = (page - 1) * limit;
        const paginated = characters.slice(start, start + parseInt(limit));

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            data: paginated,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
};

export default getCharacters;
