const date = new Date ();
const year = date.getFullYear();
document.querySelector("footer").innerHTML =`Copyright &copy; ${year} - Website created by Nima Karkhaneh`


// Displaying error when there is no post
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('viewPostsBtn');
    const noPostsMsg = document.getElementById('noPostsMessage');

    btn?.addEventListener('click', (e) => {
        if (postsCount > 0) {
            window.location.href = '/posts';
        } else {
            e.preventDefault();
            if (noPostsMsg) {
                noPostsMsg.classList.add("visible")
            }
        }
    });
});



// Removing noPosts query parameter for a clean reload
document.addEventListener('DOMContentLoaded', () => {
    // Clear query params from URL without reloading the page
    if (window.location.search.includes("noPosts=true")) {
        const url = new URL(window.location);
        url.search = ""; // remove all query params
        window.history.replaceState({}, document.title, url);
    }
});

// Edit functionality

const editForm = document.getElementById("edit-form");

if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postID = editForm.dataset.id;

        const author = editForm.elements["author"].value.trim()
        const title = editForm.elements["title"].value.trim()
        const text = editForm.elements["text"].value.trim()

        try {
            const response = await fetch(`/posts/${postID}` ,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ author, title, text })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.errors?.[0].msg || "Failed to update the post.");
                return
            }

            const result = await response.json();
            window.location.href = "/posts"

        } catch(err) {
            console.error(err.message);
            alert("Something went wrong while updating the post.")
        }

    })
}


// Delete functionality

const deleteButton = document.querySelectorAll(".delete-btn")
deleteButton.forEach(button => {
        button.addEventListener("click", async (e) => {
            const postID = e.target.dataset.id;
            const confirmDelete = confirm("Are you sure you want to delete this post?")
            if (!confirmDelete) return

            try {
                const response = await fetch(`posts/${postID}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                if (!response.ok) {
                    const err = await response.json()
                    alert(err.error || "Failed to delete post.");
                    return;
                }

                const result = await response.json();
                if (result.noPosts) {
                    window.location.href = "/?noPosts=true"
                } else {
                    window.location.reload()
                }

            } catch(err) {
                console.log(err.message)
                alert("Something went wrong while deleting the post")

            }
        });
    });

