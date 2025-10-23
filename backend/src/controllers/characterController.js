import prisma from '../utils/db.js'
import sendResponse from '../utils/response.js';

const getCharacters = async (req, res) => {
    // debugging
    console.log('🔍 getCharacters called with query:', req.query);

    try {
        const {
            affiliation,
            bounty_gte,
            bounty_lte,
            devil_fruit,
            order = 'asc',
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {}
        const orderBy = sort ? { [sort]: order.toLowerCase() == 'desc' ? 'desc' : 'asc' } : undefined;

        // Affiliation filter
        if (affiliation) filters.affiliations = { contains: affiliation, mode: 'insensitive' };

        // Devil fruit filter
        if (devil_fruit) {
            filters.devil_fruits = {
                some: {
                    name: { contains: devil_fruit, mode: 'insensitive' },
                }
            };
        }

        // Bounty filter
        if (bounty_gte || bounty_lte) {
            filters.bounty = {};

            if (bounty_gte) {
                const cleaned_gte = parseInt(bounty_gte.replace(/[^0-9]/g, '')); // remove commas
                filters.bounty.gte = cleaned_gte;
            }
            if (bounty_lte) {
                const cleaned_lte = parseInt(bounty_lte.replace(/[^0-9]/g, '')); // remove commas
                filters.bounty.lte = cleaned_lte;
            }
        }

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const [characters, total] = await Promise.all([
            prisma.characters.findMany({
                where: filters,
                include: { devil_fruits: true },
                skip,
                take,
                orderBy,
            }),
            prisma.characters.count({ where: filters }),
        ]);

        // debugging
        console.log('📊 Characters found:', characters.length);
        console.log('📈 Total count:', total);

        return sendResponse(res, 200, {
            data: characters,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, '✅ Characters fetched successfully')
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, null, "❌ Failed to fetch characters")
    }
};

export default getCharacters;

// res.json({
//     // page: parseInt(page),
//     // limit: parseInt(limit),
//     // total,
//     // data: characters,
//     page: page,
//     // limit: limit,
//     totalPages: Math.ceil(total / limit),
//     totalResults: total,
//     results: characters
// });