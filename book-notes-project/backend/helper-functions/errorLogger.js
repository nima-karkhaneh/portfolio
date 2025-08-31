function errorLogger(...args) {
    if (process.env.NODE_ENV !== "production") {
        console.error(...args);
    }
}

export default errorLogger;