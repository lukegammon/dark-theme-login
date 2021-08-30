const joi = require("joi");
const joiValidation = require("../server/validation");
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

async function validateLogin() {
    console.log("loging in");
    const loginEmailBox = document.querySelector(".login__form__email");
    const loginPasswordBox = document.querySelector(".login__form__password");
    const loginForm = document.forms["loginForm"];
    const enteredEmail = loginForm["email"].value;
    const enteredPassword = loginForm["password"].value;
    const user = {
        email: enteredEmail,
        password: enteredPassword
    }
    if(user.email === "" ||
        user.email.length < 6 ||
       !user.email.includes("@") ||
       !user.email.includes(".")
       ) {
        loginEmailBox.style.outline = "2px solid red";
        return;
    }
    if(user.password === "" ||
        user.password.length < 6) {
           loginPasswordBox.style.outline = "2px solid red";
           return;
       }
    const result = await fetch("/auth/login", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            user
        })
    }).then(console.log("done"));
    if(result.status === "ok") {
        console.log("the token is: ", result.token)
        alert("success")
    } else {
        alert(res.error);
    }
    }