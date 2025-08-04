const input = document.querySelector("input");
const error = input.dataset.error;
if (error) {
    input.placeholder = error
}