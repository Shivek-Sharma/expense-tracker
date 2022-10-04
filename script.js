const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

const localStorageTrans = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTrans : [];

//add transactions to list
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' && amount.value.trim() === '') {
        alert('Please enter the text and amount :)');
    }
    else if (type.value === '') {
        alert('Please tell if it is an income or expense');
    }
    else {
        const transaction = {
            id: Math.floor(Math.random() * 1000000),
            text: text.value,
            amount: +amount.value,
            type: type.value
        }

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
        type.value = '';
    }
}

//show transactions to DOM 
function addTransactionDOM(transaction) {
    const sign = transaction.type === 'expense' ? '-' : '+';

    const listItem = document.createElement('li');

    //add class based on value
    listItem.classList.add(transaction.type === 'expense' ? 'minus' : 'plus');

    listItem.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(listItem);
}

//update the balance, income and expense
function updateValues() {
    const income = transactions.filter(transaction => transaction.type === 'income');
    // console.log("income", income);

    const expense = transactions.filter(transaction => transaction.type === 'expense');
    // console.log("expense", expense);

    const totalIncome = (income
        .map(transaction => transaction.amount)
        .reduce((acc, amount) => (acc += amount), 0));

    const totalExpense = (expense
        .map(transaction => transaction.amount)
        .reduce((acc, amount) => (acc += amount), 0));

    const total = totalIncome >= totalExpense ? totalIncome - totalExpense : totalExpense - totalIncome;
    if (totalIncome > totalExpense) {
        balance.className = 'balance plus';
    }
    else {
        balance.className = 'balance minus';
    }

    money_plus.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${totalIncome}`;
    money_minus.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${totalExpense}`;
    balance.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${total}`;
}

//remove transaction by id
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    initializeDOM();
    updateLocalStorage();
}

//update transactions in local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//initialize the DOM
function initializeDOM() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

//event listeners
form.addEventListener('submit', addTransaction);

initializeDOM();