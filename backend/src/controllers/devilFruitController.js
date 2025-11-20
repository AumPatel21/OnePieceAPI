import prisma from '../utils/db.js'
import httpError from '../utils/httpError.js';
import sendResponse from '../utils/response.js';

export const getDevilFruits = async (req, res, next) => {
    // debugging
    console.log('🔍 getDevilFruits called with query:', req.validated?.query || req.query);
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
        } = req.validated?.query || req.query;

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

        if (devilFruits.length == 0) {
            throw httpError("No Devil Fruits found with given filters", 404);
        }

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
        next(err);
    }
};

export const getDevilFruitbyId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const devil_fruit = await prisma.devil_fruits.findUnique({
            where: { id: parseInt(id) },
        });

        if (!devil_fruit) {
            return sendResponse(res, 404, null, "❌ Character not found")
        }
        return sendResponse(res, 200, devil_fruit, "✅ Character fetched successfully")
    } catch (err) {
        next(err);
    }
};

// for PUT requests
export const updateDevilFruit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.validate?.body || req.body;

        // check if the devil fruit exists first
        const existing = await prisma.devil_fruits.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existing) {
            return httpError("❌ Character not found", 404);
        }

        const updated = await prisma.devil_fruits.update({
            where: { id: parseInt(id) },
            data
        });
        return sendResponse(res, 200, updated, "✅ Character updated successfully")
    } catch (err) {
        next(err);
    }
};