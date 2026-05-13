if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}



function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("uid");
}

function isNewTransaction() {
    const uid = getTransactionUid();
    return !uid; // Se não tem UID, é uma nova transação (true)
}


function findTransactionByUid(uid) {
    showLoading();

    transactionsServices().findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                FillTransactionScreen(transaction);
                toggleSaveButtonDisabled();
            } else {
                alert("documento não encontrado.");
                window.location.href = "../../pages/home/home.html";
            }
        })
        .catch(() => {
            hideLoading();
            alert("erro ao recuperar documento.");
            window.location.href = "../../pages/home/home.html";

        });
}

function FillTransactionScreen(transaction) {
    if (transaction.type == "expense") {
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transactionType;

    if (transaction.description) {
        form.description().value = transaction.description;
    }


}

function saveTransaction() {

    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }

}

function save(transaction) {

    showLoading();

    transactionsServices().save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../pages/home/home.html";
        })

        .catch(() => {
            hideLoading();
            alert("Ocorreu um erro ao salvar a transação.");
        })

}

function update(transaction) {
    showLoading();

    transactionsServices().update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../pages/home/home.html";
        })

        .catch(() => {
            hideLoading();
            alert("Ocorreu um erro ao salvar a transação.");
        });
}

function createTransaction() {
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}



function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisabled()

}

function onChangeValue() {
    const value = form.value().value;

    form.valueRequiredError().style.display = !value ? "block" : "none";

    form.valueLessOrEqualToZeroError().style.display = value <= 0 ? "block" : "none";

    toggleSaveButtonDisabled()
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    console.log(transactionType)
    form.transactionTypeRequiredError().style.display = !transactionType ? "block" : "none";

    toggleSaveButtonDisabled()
}

function toggleSaveButtonDisabled() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const value = form.value().value;
    if (!value || value <= 0) {
        return false;
    }

    const transactionType = form.transactionType().value;
    if (!transactionType) {
        return false;
    }

    return true;


}


const form = {
    date: () => document.getElementById("date"),
    description: () => document.getElementById("description"),
    currency: () => document.getElementById("currency"),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById("save-button"),
    transactionType: () => document.getElementById("transaction-type"),
    transactionTypeRequiredError: () => document.getElementById('transaction-type-required-error'),
    typeExpense: () => document.getElementById("expense"),
    typeIncome: () => document.getElementById("income"),
    value: () => document.getElementById("value"),
    valueRequiredError: () => document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: () => document.getElementById('value-less-or-equal-to-zero-error')
}