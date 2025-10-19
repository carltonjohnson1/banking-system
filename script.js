class BankAccount {
    constructor(accountNumber, accountHolder, balance = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
        return `$${amount} deposited. Current balance: $${this.balance}`;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            return "Insufficient funds";
        } else {
            this.balance -= amount;
            return `$${amount} withdrawn. Current balance: $${this.balance}`;
        }
    }

    checkBalance() {
        return `Account balance for ${this.accountHolder}: $${this.balance}`;
    }
}

const accounts = new Map();

function createAccount() {
    const nameInput = document.querySelector("#accountHolder");
    const balanceInput = document.querySelector("#initialBalance");
    const output = document.querySelector("#output");

    const accountHolder = (nameInput.value || "").trim();
    let initialBalance = parseFloat(balanceInput.value);
    if (!accountHolder) {
        output.innerText = "Please enter the account holder's name.";
        return;
    }
    if (isNaN(initialBalance) || initialBalance < 0) {
        initialBalance = 0;
    }

    const accountNumber = Math.floor(Math.random() * 1000000);
    const newAccount = new BankAccount(accountNumber, accountHolder, initialBalance);
    accounts.set(accountNumber, newAccount);

    const acctNumInput = document.querySelector("#accountNumber");
    if (acctNumInput) {
        acctNumInput.value = String(accountNumber);
    }

    output.innerText = `Account created for ${accountHolder}. Balance: $${initialBalance}. Account Number: ${accountNumber}`;
}

function deposit() {
    const output = document.querySelector("#output");
    const accountNumber = parseInt(document.querySelector("#accountNumber").value);
    const amount = parseFloat(document.querySelector("#amount").value);
    if (isNaN(accountNumber)) {
        output.innerText = "Please enter a valid account number.";
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        output.innerText = "Please enter a deposit amount greater than 0.";
        return;
    }
    const account = accounts.get(accountNumber);
    if (account) {
        output.innerText = account.deposit(amount);
    } else {
        output.innerText = "Account not found";
    }
}

function withdraw() {
    const output = document.querySelector("#output");
    const accountNumber = parseInt(document.querySelector("#accountNumber").value);
    const amount = parseFloat(document.querySelector("#amount").value);
    if (isNaN(accountNumber)) {
        output.innerText = "Please enter a valid account number.";
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        output.innerText = "Please enter a withdrawal amount greater than 0.";
        return;
    }
    const account = accounts.get(accountNumber);
    if (account) {
        output.innerText = account.withdraw(amount);
    } else {
        output.innerText = "Account not found";
    }
}

function checkBalance() {
    const output = document.querySelector("#output");
    const accountNumber = parseInt(document.querySelector("#accountNumber").value);
    if (isNaN(accountNumber)) {
        output.innerText = "Please enter a valid account number.";
        return;
    }
    const account = accounts.get(accountNumber);
    if (account) {
        output.innerText = account.checkBalance();
    } else {
        output.innerText = "Account not found";
    }
}








