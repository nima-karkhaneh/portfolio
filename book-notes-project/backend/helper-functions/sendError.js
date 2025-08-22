function sendError(res, status, message, details = []) {
    res.status(status).json({
        error: {
            message,
            details
        }
    })
}


export default sendError;