firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(error => {
        alert("Erro ao sair: " + error.message);
    });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        findTransactions(user);
    }
})

function newTransaction() {
    window.location.href = "../../pages/transactions.html";
}


function findTransactions(user) {
    showLoading();
    transactionsServices().fidByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })

        .catch(error => {
            hideLoading();
            console.log(error);
            alert("erro ao recuperar transações.");
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById("transactions")

    transactions.forEach(transaction => {
        const li = creteTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));

        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.transactionType));
        if (transaction.description) {
            li.appendChild((createParagraph(transaction.description)));
        }

        orderedList.appendChild(li)
    });
}

function creteTransactionListItem(transaction) {
    console.log(transaction);
    const li = document.createElement("li");
    li.classList.add(transaction.type);
    li.id = transaction.uid;
    li.addEventListener("click", () => {
        window.location.href = "../../pages/transactions.html?uid=" + transaction.uid;
    })

    return li;
}

function createDeleteButton(transaction) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Excluir";
    deleteButton.classList.add("outline", "danger");
    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    })
    return deleteButton;

}

function createParagraph(value) {
    const element = document.createElement("p");
    element.innerHTML = value;
    return element;
}



function askRemoveTransaction(transaction) {
    const shouldRemove = confirm("Deseja realmente excluir esta transação?");
    if (shouldRemove) {
        removeTransaction(transaction);
    }

}

function removeTransaction(transaction) {
    showLoading();

    transactionsServices().remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.error("Erro ao excluir transação:", error);
            alert("Erro ao excluir transação.");
        });
}

function formatDate(date) {
    const parts = date.split("/");
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const normalizedYear = year.length === 2 ? `20${year}` : year;
        const parsed = new Date(`${normalizedYear}-${month}-${day}`);
        if (!isNaN(parsed)) {
            return parsed.toLocaleDateString("pt-BR");
        }
    }

    const parsed = new Date(date);
    return isNaN(parsed) ? date : parsed.toLocaleDateString("pt-BR");
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}
