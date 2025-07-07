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

// Toast messages
function showToast(message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}


// Preloader spinner on each page

window.addEventListener("load", ()=>{
    const loader = document.querySelector(".spinner-cont");
    loader.classList.add("spinner-hidden");
    loader.addEventListener("transitionend", ()=>{
        loader.remove();
    })
})

// Bottom button spinner after form submission
function smallSpinner (){
    const spin = document.querySelector(".btm-btn");
    spin.innerHTML = " <div class=\"sml-spinner\"></div>";
    spin.style.backgroundColor = "rgb(227, 223, 214)";
}