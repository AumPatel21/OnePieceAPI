import sendResponse from "../utils/response.js";

// function to handle errors globally
const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);
    const status = err.statusCode || 500;
    const message = err.message || "❌ Internal Server Error";
    res.status(status);
    return sendResponse(res, status, null, message);
};

export default errorHandler;
