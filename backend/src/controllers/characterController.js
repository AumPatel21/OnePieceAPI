import prisma from '../utils/db.js'
import sendResponse from '../utils/response.js';
// TODO work on bounty filtering issue!!!
const getCharacters = async (req, res) => {
    // debugging
    console.log('🔍 getCharacters called with query:', req.query);

    try {
        const {
            name,
            affiliation,
            occupation,
            bounty_gte,
            bounty_lte,
            status,
            devil_fruit,
            order = 'asc',
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {}
        // responses can be sorted ascending or descending
        const orderBy = sort ? { [sort]: order.toLowerCase() == 'desc' ? 'desc' : 'asc' } : undefined;

        // multiple filters to get a variety of responses
        if (name) filters.name = { contains: name, mode: 'insensitive' };
        if (affiliation) filters.affiliations = { contains: affiliation, mode: 'insensitive' };
        if (occupation) filters.occupation = { contains: occupation, mode: 'insensitive' };
        if (devil_fruit) {
            filters.devil_fruits = {
                some: {
                    name: { contains: devil_fruit, mode: 'insensitive' },
                }
            };
        }
        if (bounty_gte || bounty_lte) {
            filters.bounty_numeric = {};
            console.log('💰 Bounty filters - raw:', { bounty_gte, bounty_lte });

            // const cleaned_gte = parseInt(bounty_gte);
            // const cleaned_lte = parseInt(bounty_lte);
            // added !isNaN() to for input validation  
            if (bounty_gte) {
                const cleaned_gte = parseInt(bounty_gte);
                console.log('💰 GTE - parsed:', cleaned_gte, 'valid:', !isNaN(cleaned_gte));
                if (!isNaN(cleaned_gte)) {
                    filters.bounty_numeric.gte = cleaned_gte;
                }
            }
            if (bounty_lte) {
                const cleaned_lte = parseInt(bounty_lte);
                console.log('💰 LTE - parsed:', cleaned_lte, 'valid:', !isNaN(cleaned_lte));
                if (!isNaN(cleaned_lte)) {
                    filters.bounty_numeric.lte = cleaned_lte;
                }
            }
            console.log('💰 Final bounty filter:', filters.bounty_numeric);
            // If no valid filters, remove the empty object
            if (Object.keys(filters.bounty_numeric).length === 0) {
                delete filters.bounty_numeric;
                console.log('💰 No valid bounty filters applied');
            }
        }
        if (status) filters.status = { contains: status, mode: 'insensitive' };

        const [characters, total] = await Promise.all([
            prisma.characters.findMany({
                where: filters,
                include: { devil_fruits: true },
                skip: (page - 1) * limit,
                take: parseInt(limit),
                orderBy,
            }),
            prisma.characters.count({ where: filters }),
        ]);

        // debugging
        console.log('📊 Characters found:', characters.length);
        console.log('📈 Total count:', total);

        return sendResponse(res, 200, {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            results: characters,
        }, '✅ Characters fetched successfully')
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, null, "❌ Failed to fetch characters")
    }
};

export default getCharacters;