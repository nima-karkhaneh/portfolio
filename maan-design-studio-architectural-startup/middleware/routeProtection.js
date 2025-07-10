// routeProtection.js

import { dirname } from "path";
import path from "path"
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const viewsPath = path.resolve(__dirname, "../views");
export function protectSuccessPage(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
    if (req.session.allowSuccessPage) {
        delete req.session.allowSuccessPage;
        return next();
    }
    res.status(403).sendFile(path.join(viewsPath, "403-forbidden-page.html"))
}

export function protectUnsuccessPage(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
    if (req.session.allowUnsuccessPage) {
        delete req.session.allowUnsuccessPage;
        return next();
    }
    res.status(403).sendFile(path.join(viewsPath, "403-forbidden-page.html"))
}