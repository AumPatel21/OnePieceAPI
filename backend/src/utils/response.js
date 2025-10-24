const sendResponse = (res, status_code, data = null, message = null) => {
    const success = status_code < 400;
    const response = {
        success,
        status: status_code,
    };
    if (message) response.message = message;
    if (data != null) {
        response.data = JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value == 'bigint' ? value.toString() : value
        ));
    };

    res.status(status_code).json(response);
}

export default sendResponse;