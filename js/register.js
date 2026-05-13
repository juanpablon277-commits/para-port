firebase.auth().onAuthStateChanged (user => {
    if (user) {
        window.location.href = "../home/home.html";
    }
})


function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? 'none' : 'block';
    // Se tem algo, valida o formato (ajustado a lógica)
    form.emailInvalidError().style.display = validateEmail(email) ? 'none' : 'block';

    toggleRegisterButtonDisable();
}

function onChangePassword() {

    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? 'none' : 'block';
    form.passwordMinLengthError().style.display = password.length >= 6 ? 'none' : 'block';

    validatePasswordsMatch();
    toggleRegisterButtonDisable();

}


function onChangeConfirmPassword() {
    validatePasswordsMatch();
    toggleRegisterButtonDisable();
}

function register() {
    showLoading();

    const email = form.email().value;
    const password = form.password().value;
    firebase.auth().createUserWithEmailAndPassword(
        email, password
    ).then(() => {
        hideLoading();
        window.location.href = "../home/home.html";
    }).catch((error) => {
        hideLoading();
        alert("Erro ao registrar: " + getErrorMessage(error));  
    });

}

function getErrorMessage(error) {
    if (error.code === "auth/email-already-in-use") {
        return "O email já está em uso por outra conta.";
    }
    return error.message;

}


function validatePasswordsMatch() {
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;

    form.confirmPasswordDoesntMatchError().style.display =
        password === confirmPassword ? 'none' : 'block';
}

function toggleRegisterButtonDisable() {
    document.getElementById("register-button").disabled = !isFormValid();
}

function isFormValid() {
    const email = form.email().value;
    if (!email || !validateEmail(email)) {
        return false;
        // Se o email não existir ou for inválido, retorna falso
    }

    const password = form.password().value;
    if (!password || password.length < 6) {
        return false;
        // Se a senha não existir ou tiver menos de 6 caracteres, retorna falso
    }

    const confirmPassword = form.confirmPassword().value;
    if (password !== confirmPassword) {
        return false;
        //se a senha não for igual a confirmação, retorna falso
    }

    return true;
}



// Função auxiliar simples para o email não dar erro
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

const form = {
    confirmPassword: () => document.getElementById('confirm-password'),
    confirmPasswordDoesntMatchError: () => document.getElementById('password-doesnt-match-error'),
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    password: () => document.getElementById('password'),
    passwordMinLengthError: () => document.getElementById('password-min-length-error'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    registerButton: () => document.getElementById('register-button'),
}   