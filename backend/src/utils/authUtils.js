import sendResponse from "./response.js";

const authAdmin = (req, res, next) => {
    const api_key = req.headers['x-api-key'];

    if (!api_key || api_key !== process.env.ADMIN_API_KEY) {
        console.warn(`⚠️ Unauthorized access attempt from IP: ${req.ip}`);
        return sendResponse(res, 401, null, "⚠️ Unauthorized")
    }
    next();
}

export default authAdmin;