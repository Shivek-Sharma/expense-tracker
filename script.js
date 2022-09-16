const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTrans = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTrans : [];

//add transactions to list
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' && amount.value.trim() === '') {
        alert('Please enter the text and amount :)');
    }
    else {
        const transaction = {
            id: Math.floor(Math.random() * 1000000),
            text: text.value,
            amount: +amount.value
        }

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

//show transactions to DOM 
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const listItem = document.createElement('li');

    //add class based on value
    listItem.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    listItem.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(listItem);
}

//update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    // console.log(amounts);

    const total = amounts.reduce((acc, amount) => (acc += amount), 0);
    if (total > 0) {
        balance.className = 'balance plus';
    }
    else {
        balance.className = 'balance minus';
    }

    const income = amounts
        .filter(amount => amount > 0)
        .reduce((acc, amount) => (acc += amount), 0);

    const expense = (amounts
        .filter(amount => amount < 0)
        .reduce((acc, amount) => (acc += amount), 0)) * -1;

    money_plus.innerHTML = `+ <i class="fa-solid fa-indian-rupee-sign"></i>${income}`;
    money_minus.innerHTML = `- <i class="fa-solid fa-indian-rupee-sign"></i>${expense}`;
    balance.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${total > 0 ? total : total * -1}`;
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