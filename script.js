class BankAccount {
  constructor(accountNumber, accountHolder, balance = 0) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = balance;
    this.transactions = [];
  }

  deposit(amount) {
    this.balance += amount;
    this.transactions.push({ type: "Deposit", amount, date: new Date() });
    return `$${amount} deposited. Current balance: $${this.balance}`;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      return "Insufficient funds";
    }
    this.balance -= amount;
    this.transactions.push({ type: "Withdraw", amount, date: new Date() });
    return `$${amount} withdrawn. Current balance: $${this.balance}`;
  }

  checkBalance() {
    return `Account balance for ${this.accountHolder}: $${this.balance}`;
  }

  transferTo(otherAccount, amount) {
    if (amount > this.balance) return "Insufficient funds for transfer.";
    this.withdraw(amount);
    otherAccount.deposit(amount);
    this.transactions.push({ type: "Transfer Out", amount, to: otherAccount.accountNumber, date: new Date() });
    otherAccount.transactions.push({ type: "Transfer In", amount, from: this.accountNumber, date: new Date() });
    return `Transferred $${amount} from ${this.accountNumber} to ${otherAccount.accountNumber}`;
  }
}

const accounts = new Map();

// ---------------- Helper functions ----------------
function setOutput(message, type = "info") {
  const output = document.querySelector("#output");
  output.className = `output ${type}`;
  output.innerHTML = message;
  saveAccounts();
}

function saveAccounts() {
  localStorage.setItem("accounts", JSON.stringify(Array.from(accounts.entries())));
}

function loadAccounts() {
  const saved = JSON.parse(localStorage.getItem("accounts"));
  if (saved) {
    saved.forEach(([num, acc]) => {
      const account = Object.assign(new BankAccount(), acc);
      accounts.set(Number(num), account);
    });
  }
}

// ---------------- Core actions ----------------
function createAccount() {
  const nameInput = document.querySelector("#accountHolder");
  const balanceInput = document.querySelector("#initialBalance");

  const accountHolder = nameInput.value.trim();
  let initialBalance = parseFloat(balanceInput.value);
  if (!accountHolder) return setOutput("Please enter the account holder's name.", "error");
  if (isNaN(initialBalance) || initialBalance < 0) initialBalance = 0;

  const accountNumber = Math.floor(Math.random() * 1000000);
  const newAccount = new BankAccount(accountNumber, accountHolder, initialBalance);
  accounts.set(accountNumber, newAccount);
  setOutput(`✅ Account created for ${accountHolder}. Balance: $${initialBalance}. Account Number: ${accountNumber}`, "success");
  displayAccounts();
}

function deposit() {
  const accountNumber = parseInt(document.querySelector("#accountNumber").value);
  const amount = parseFloat(document.querySelector("#amount").value);
  const account = accounts.get(accountNumber);

  if (!account) return setOutput("Account not found.", "error");
  if (isNaN(amount) || amount <= 0) return setOutput("Enter a valid deposit amount.", "error");

  setOutput(account.deposit(amount), "success");
  displayAccounts();
}

function withdraw() {
  const accountNumber = parseInt(document.querySelector("#accountNumber").value);
  const amount = parseFloat(document.querySelector("#amount").value);
  const account = accounts.get(accountNumber);

  if (!account) return setOutput("Account not found.", "error");
  if (isNaN(amount) || amount <= 0) return setOutput("Enter a valid withdrawal amount.", "error");

  const result = account.withdraw(amount);
  const type = result.includes("Insufficient") ? "error" : "success";
  setOutput(result, type);
  displayAccounts();
}

function checkBalance() {
  const accountNumber = parseInt(document.querySelector("#accountNumber").value);
  const account = accounts.get(accountNumber);
  if (!account) return setOutput("Account not found.", "error");
  setOutput(account.checkBalance(), "info");
}

function transfer() {
  const fromNum = parseInt(document.querySelector("#transferFrom").value);
  const toNum = parseInt(document.querySelector("#transferTo").value);
  const amount = parseFloat(document.querySelector("#transferAmount").value);

  const fromAcc = accounts.get(fromNum);
  const toAcc = accounts.get(toNum);
  if (!fromAcc || !toAcc) return setOutput("Invalid account numbers.", "error");
  if (isNaN(amount) || amount <= 0) return setOutput("Enter a valid transfer amount.", "error");

  const result = fromAcc.transferTo(toAcc, amount);
  const type = result.includes("Insufficient") ? "error" : "success";
  setOutput(result, type);

  // ✅ Automatically set the account number input to the "from" account
  document.querySelector("#accountNumber").value = fromNum;

  displayAccounts();
}


function viewTransactions() {
  const accountNumber = parseInt(document.querySelector("#accountNumber").value);
  const account = accounts.get(accountNumber);
  if (!account) return setOutput("Account not found.", "error");

  if (account.transactions.length === 0) {
    return setOutput("No transactions found for this account.", "info");
  }

  const table = `
    <h3>Transaction History for ${account.accountHolder}</h3>
    <table>
      <tr><th>Type</th><th>Amount</th><th>Date</th><th>Details</th></tr>
      ${account.transactions
        .map(
          (t) =>
            `<tr><td>${t.type}</td><td>$${t.amount}</td><td>${new Date(t.date).toLocaleString()}</td><td>${t.to || t.from || ""}</td></tr>`
        )
        .join("")}
    </table>
  `;
  setOutput(table, "info");
}

function displayAccounts() {
  if (accounts.size === 0) return setOutput("No accounts created yet.", "info");

  const table = `
    <h3>All Accounts</h3>
    <table>
      <tr><th>Account #</th><th>Holder</th><th>Balance</th></tr>
      ${Array.from(accounts.values())
        .map(
          (acc) =>
            `<tr><td>${acc.accountNumber}</td><td>${acc.accountHolder}</td><td>$${acc.balance.toFixed(2)}</td></tr>`
        )
        .join("")}
    </table>
  `;
  setOutput(table, "info");
}

function clearAllAccounts() {
  if (confirm("Are you sure you want to delete ALL accounts? This cannot be undone.")) {
    accounts.clear();
    localStorage.removeItem("accounts");
    document.querySelector("#accountNumber").value = "";
    document.querySelector("#amount").value = "";
    document.querySelector("#transferFrom").value = "";
    document.querySelector("#transferTo").value = "";
    document.querySelector("#transferAmount").value = "";
    setOutput("✅ All accounts have been cleared.", "success");
  }
}


// Load saved data on startup
window.addEventListener("load", loadAccounts);
