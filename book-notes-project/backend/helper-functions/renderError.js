function renderError(res, status, error) {
    return res.status(status).render("error.ejs", {
        status,
        error
    })
}

export default renderError;