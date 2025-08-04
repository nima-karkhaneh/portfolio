const input = document.querySelector("input");
const error = input.dataset.error;
if (error) {
    input.placeholder = error
}


document.querySelector("form").addEventListener("submit", (e) => {
    const value = input.value.trim()
    const valid = /^[A-Za-z\s\-']{2,50}/.test(value);

    if (!valid) {
        e.preventDefault();
        input.value= "";
        input.placeholder= "Enter a valid Australian town name"
    }
})