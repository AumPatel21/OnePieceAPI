import prisma from '../utils/db.js'
import httpError from '../utils/httpError.js';
import sendResponse from '../utils/response.js';

export const getCharacters = async (req, res, next) => {
    // debugging
    console.log('🔍 getCharacters called with query:', req.validated.query || req.query);
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
        } = req.validated?.query || req.query;

        const filters = {}
        // responses can be sorted ascending or descending
        const orderBy = sort ? { [sort]: order.toLowerCase() == 'desc' ? 'desc' : 'asc' } : undefined;

        // multiple filters for search flexibility
        if (name) filters.name = { contains: name, mode: 'insensitive' };
        if (affiliation) filters.affiliations = { contains: affiliation, mode: 'insensitive' };
        if (occupation) filters.occupation = { contains: occupation, mode: 'insensitive' };
        if (devil_fruit) {
            filters.devil_fruits = {
                some: { name: { contains: devil_fruit, mode: 'insensitive' } },
            };
        }
        if (bounty_gte || bounty_lte) {
            console.log('💰 Bounty filters - raw:', { bounty_gte, bounty_lte });
            filters.bounty_numeric = {};
            if (bounty_gte) {
                console.log('💰 GTE - parsed:', bounty_gte);
                filters.bounty_numeric.gte = bounty_gte;
            }
            if (bounty_lte) {
                console.log('💰 LTE - parsed:', bounty_lte);
                filters.bounty_numeric.lte = bounty_lte;
            }
            console.log('💰 Final bounty filter:', filters.bounty_numeric);
            if (Object.keys(filters.bounty_numeric).length === 0) {
                delete filters.bounty_numeric;
                console.log('💰 No valid bounty filters applied');
            }
        }
        if (status) filters.status = { contains: status, mode: 'insensitive' };

        // database queries
        const [characters, total] = await Promise.all([
            prisma.characters.findMany({
                where: filters,
                include: { devil_fruits: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
            }),
            prisma.characters.count({ where: filters }),
        ]);

        if (characters.length == 0) {
            throw httpError("❌ No characters found with given filters", 404);
        }

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
        next(err);
    }
};

export const getCharacterById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const character = await prisma.characters.findUnique({
            where: { id: parseInt(id) },
            include: { devil_fruits: true },
        });

        if (!character) {
            return sendResponse(res, 404, null, "❌ Character not found")
        }
        return sendResponse(res, 200, character, "✅ Character fetched successfully")
    } catch (err) {
        next(err);
    }
};

// for PUT requests
export const updateCharacter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.validated?.body || req.body;

        // check if the character exists first
        const existing = await prisma.characters.findUnique({
            where: { id: parseInt(id) },
            include: { devil_fruits: true },
        });

        if (!existing) {
            throw httpError("❌ Character not found", 404);
        }

        // update character
        const updated = await prisma.characters.update({
            where: { id: parseInt(id) },
            data
        });
        return sendResponse(res, 200, updated, "✅ Character updated successfully")
    } catch (err) {
        next(err);
    }
};