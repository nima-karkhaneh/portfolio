const date = new Date ();
const year = date.getFullYear();
document.querySelector("footer").innerHTML = `<p>Copyright &copy; ${year} - Website created by Nima Karkhaneh</p><p><i class=\"fa-solid fa-envelope\"></i>nimakarkahneh@gmail.com</p><p><a href=\"/\"><i class=\"fab fa-linkedin\"></a></i><a href=\"/\"><i class=\"fa-brands fa-github\"></i></a></p>`;
const stars = document.querySelectorAll(".star-ranking");
stars.forEach((star, index1) =>{
    star.addEventListener("click", ()=>{
        stars.forEach((star, index2)=>{
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
        })
    })
})
