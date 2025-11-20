import { ZodError } from "zod";
import httpError from "../utils/httpError.js";

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        req.validated = parsed;
        next();
    } catch (err) {
        // if (err instanceof ZodError) {
        //     return next(httpError(err.errors, 400));
        // }
        if (err instanceof ZodError && Array.isArray(err.errors)) {
            // Convert the array of errors to a JSON string
            const formattedErrors = err.errors.map(e => ({
                path: e.path.join('.') || '(root)',
                message: e.message
            }));
            return next(httpError((formattedErrors), 400));
        }
        next(err);
    }
};

export default validate;