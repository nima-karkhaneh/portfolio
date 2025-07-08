// routeProtection.js
export function protectSuccessPage(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
    if (req.session.allowSuccessPage) {
        delete req.session.allowSuccessPage;
        return next();
    }
    res.status(403).json( { error: "403 | access forbidden"} )
}

export function protectUnsuccessPage(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
    if (req.session.allowUnsuccessPage) {
        delete req.session.allowUnsuccessPage;
        return next();
    }
    res.status(403).json( {error: "403 | access forbidden"} )
}