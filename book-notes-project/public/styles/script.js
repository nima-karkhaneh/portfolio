const date = new Date ();
const year = date.getFullYear();
document.querySelector("footer").innerHTML = `<p>Copyright &copy; ${year} - Website created by Nima Karkhaneh</p><p><i class=\"fa-solid fa-envelope\"></i>nimakarkahneh@gmail.com</p><p><a href=\"/\"><i class=\"fab fa-linkedin\"></a></i><a href="https://github.com/nima-karkhaneh"><i class=\"fa-brands fa-github\"></i></a></p>`;


// Star rating functionality on add.ejs & edit.ejs

const stars = document.querySelectorAll(".star-ranking");
stars.forEach((star, index1) =>{
    star.addEventListener("click", ()=>{
        stars.forEach((star, index2)=>{
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
        })
    })
})

// Star display colouring on books.ejs

if (window.ratingData) {
    window.ratingData.forEach(d => {
        const stars = document.querySelectorAll(`.star${d.library_id}`);
        if (stars) {
            stars.forEach((star, i) => {
                star.style.color = i < d.rate ? "#dabd18b2" : "#ccc";
            });
        }
    });
}


// DELETE FUNCTIONALITY USING FETCH API

const deleteButton = document.querySelectorAll(".delete")
deleteButton.forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const id = btn.dataset.id;
        console.log(id)
        const confirmDelete = confirm("Are you sure you want to delete this post?")
        if (!confirmDelete) return
        try {
            const respone = await fetch(`/books/delete/${id}`, { method: "POST" });
            if (!respone.ok) {
                alert("failed to delete the post")
            }
            window.location.reload()

        }
        catch(err) {
            console.error(err.message)
        }

    })
})

