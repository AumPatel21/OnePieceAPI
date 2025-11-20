// helper fuction to throw errors
const httpError = (message, status_code = 500) => {
    const err = new Error(typeof message === "string" ? message : JSON.stringify(message));
    err.statusCode = status_code;
    return err;
};

export default httpError;