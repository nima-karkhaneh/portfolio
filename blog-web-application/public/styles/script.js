const date = new Date ();
const year = date.getFullYear();
document.querySelector("footer").innerHTML =`Copyright &copy; ${year} - Website created by Nima Karkhaneh`


// Displaying error when there is no post
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('viewPostsBtn');
    const noPostsMsg = document.getElementById('noPostsMessage');

    btn?.addEventListener('click', (e) => {
        if (window.postsCount > 0) {
            window.location.href = '/posts';
        } else {
            e.preventDefault();
            if (noPostsMsg) {
                noPostsMsg.classList.add("visible")
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Clear query params from URL without reloading the page
    if (window.location.search.includes("noPosts=true")) {
        const url = new URL(window.location);
        url.search = ""; // remove all query params
        window.history.replaceState({}, document.title, url);
    }
});

