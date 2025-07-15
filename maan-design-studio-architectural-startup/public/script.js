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
function showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Avoid showing duplicate message
    const existing = Array.from(container.children).find(child => child.textContent === message);
    if (existing) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            toast.remove();
            resetButton();
        });
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
    spin.innerHTML = "<div class=\"sml-spinner\"></div>";
    spin.disabled = true;
}

function resetButton() {
    const spin = document.querySelector(".btm-btn");
    spin.textContent = "Submit";
    spin.disabled = false;
}



// Handle form submission with fetch
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        smallSpinner();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok && result.redirectTo) {
                window.location.href = result.redirectTo;
            } else if (response.status === 400 && result.errors) {
                result.errors.forEach(err => showToast(err.msg));
                resetButton();
            } else {
                showToast("Something went wrong. Please try again.");
                resetButton();
            }
        } catch (err) {
            console.error("Submission error:", err);
            showToast("Submission failed. Check your connection.");
            resetButton();
        }
    });
});
