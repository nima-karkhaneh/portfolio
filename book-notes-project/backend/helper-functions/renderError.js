function renderError(res, status, error) {
    return res.status(status).render("error.ejs", {
        status,
        error
    })
}

function renderPostError(res, status, error) {
    return res.status(status).render("add.ejs", {
        error
    })
}

export default renderError;
export { renderPostError }