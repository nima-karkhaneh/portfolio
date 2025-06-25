// Footer content

const date = new Date ();
const year = date.getFullYear();
document.querySelector("footer div").innerHTML =`Copyright &copy; www.maandesignstudio.com ${year}`

// Flyout Menu

const offScreenMenu = document.querySelector(".off-screen-menu");
const hamMenu = document.querySelector(".ham-menu-img");
hamMenu.addEventListener("click", () =>{
    offScreenMenu.classList.toggle("active");
})

// Preloader spinner on each page

window.addEventListener("load", ()=>{
    const loader = document.querySelector(".spinner-cont");
    loader.classList.add("spinner-hidden");
    loader.addEventListener("transitioned", ()=>{
        document.body.removeChild()
    })
})

// Bottom button spinner after form submission
function smallSpinner (){
    const spin = document.querySelector(".btm-btn");
    spin.innerHTML = " <div class=\"sml-spinner\"></div>";
    spin.style.backgroundColor = "rgb(227, 223, 214)";
}