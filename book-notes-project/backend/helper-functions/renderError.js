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

function renderPostError(res, status, error, formData) {
    return res.status(status).render("add.ejs", {
        error,
        formData
    })
}

function renderEditError(res, status, error, formData, formId) {
    return res.status(status).render("edit.ejs", {
        error,
        formData,
        formId
    })
}

export default renderError;
export { renderNoBookError };
export { renderPostError };
export { renderEditError }
