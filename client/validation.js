const loginButton = document.querySelector(".login__form__btn");
const loginEmailOutline = document.querySelector(".login__form__email");
const loginPasswordOutline = document.querySelector(".login__form__password");

// Reset outline to default on form input click
loginEmailOutline.addEventListener("click", () => loginEmailOutline.style.outline = "");
loginPasswordOutline.addEventListener("click", () => loginPasswordOutline.style.outline = "");

// Client Side Form Validation for User Login 
loginButton.addEventListener("click", (event) => {
    validateLogin();
})

function validateLogin() {
    const loginEmailBox = document.querySelector(".login__form__email");
    const loginPasswordBox = document.querySelector(".login__form__password");
    const loginForm = document.forms["loginForm"];
    const enteredEmail = loginForm["email"].value;
    const enteredPassword = loginForm["password"].value;
    if(enteredEmail === "" ||
        enteredEmail.length < 6 ||
       !enteredEmail.includes("@") ||
       !enteredEmail.includes(".")
       ) {
        loginEmailBox.style.outline = "2px solid red";
        return;
    }
    if(enteredPassword === "" ||
       enteredPassword.length < 6) {
           loginPasswordBox.style.outline = "2px solid red";
           return;
       }
    }