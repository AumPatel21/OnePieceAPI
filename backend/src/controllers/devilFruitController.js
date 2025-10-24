import prisma from '../utils/db.js'
import sendResponse from '../utils/response.js';

const getDevilFruits = async (req, res) => {
    // debugging
    console.log('🔍 getDevilFruits called with query:', req.query);
    try {
        const {
            name,
            type,
            current_owner,
            previous_owner,
            status,
            order = 'asc',
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {};
        const orderBy = sort ? { [sort]: order.toLowerCase() == 'desc' ? 'desc' : 'asc' } : undefined;

        if (name) filters.name = { contains: name, mode: 'insensitive' };
        if (type) filters.type = { contains: type, mode: 'insensitive' };
        if (current_owner) filters.current_owner = { contains: current_owner, mode: 'insensitive' };
        if (previous_owner) filters.previous_owner = { contains: previous_owner, mode: 'insensitive' };
        if (status) filters.status = { contains: status, mode: 'insensitive' };

        const [devilFruits, total] = await Promise.all([
            prisma.devil_fruits.findMany({
                where: filters,
                skip: (page - 1) * limit,
                take: parseInt(limit),
                orderBy,
            }),
            await prisma.devil_fruits.count({ where: filters }),
        ]);

        // debugging
        console.log('📊 Characters found:', devilFruits.length);
        console.log('📈 Total count:', total);

        return sendResponse(res, 200, {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            results: devilFruits,
        }, '✅ Devil Fruits fetched successfully');
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, null, "❌ Failed to fetch characters")
    }
};

export default getDevilFruits;