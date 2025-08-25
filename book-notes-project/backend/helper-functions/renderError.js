function renderError(res, status, error) {
    return res.status(status).render("error.ejs", {
        status,
        error
    })
}

function renderNoBookError(res, status, error) {
    return res.status(status).render("index.ejs", {
        error
    })
}

function renderPostError(res, status, error) {
    return res.status(status).render("add.ejs", {
        error
    })
}

export default renderError;
export { renderNoBookError };
export { renderPostError };
