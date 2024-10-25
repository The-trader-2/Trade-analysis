let initialAmount = 500; // Default starting amount for Day 1
let perTradePercentage = 2; // 1% rule
let resultTradePercentage = 85; // Default percentage for trade result calculation
let totalTradesTaken = 1; // Default total trades taken each day
let days = 360; // Default number of days
const maxAmount = 3000; // Maximum amount to use per trade calculation

let totalAmounts = []; // For tracking daily total amounts
let labels = []; // For day labels
let tablesWrapper; // To store tables for recalculations
let updatedAmounts = []; // Track updated amounts after withdrawals

function startCalculation() {
    initialAmount = parseFloat(document.getElementById("initialAmountInput").value) || 500;
    resultTradePercentage = parseFloat(document.getElementById("resultTradePercentageInput").value) || 85;
    totalTradesTaken = parseInt(document.getElementById("totalTradesTakenInput").value) || 1;
    days = parseInt(document.getElementById("daysInput").value) || 360;

    calculateTradeAnalysis();
}

function createTable() {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>S.No</th>
        <th>Day</th>
        <th>Amount ($)</th>
        <th>Per Trade Amount ($)</th>
        <th>Result of Trade ($)</th>
        <th>Total Trades Result ($)</th>
        <th>Total Amount ($)</th>
    `;
    return table;
}

function addRow(table, sno, day, amount, perTrade, resultOfTrade, totalTradesResult, totalAmount) {
    const row = table.insertRow();
    row.insertCell(0).innerText = sno;
    row.insertCell(1).innerText = day;
    row.insertCell(2).innerText = amount.toFixed(2);
    row.insertCell(3).innerText = perTrade;
    row.insertCell(4).innerText = resultOfTrade.toFixed(2);
    row.insertCell(5).innerText = totalTradesResult.toFixed(2);
    row.insertCell(6).innerText = totalAmount.toFixed(2);

    if (sno % 30 === 0) {
        row.classList.add('highlight');
    }
}

function addWithdrawSection(table, dayCount, totalAmount) {
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 7;

    const profitMessage = document.createElement('div');
    profitMessage.innerText = `Profit of 30 Days is: $${totalAmount.toFixed(2)}`;
    profitMessage.style.marginBottom = '10px';
    profitMessage.id = `profitMessage${dayCount}`;

    const withdrawInput = document.createElement('input');
    withdrawInput.type = 'number';
    withdrawInput.placeholder = 'Withdraw Amount';
    withdrawInput.id = `withdrawAmount${dayCount}`;

    const withdrawButton = document.createElement('button');
    withdrawButton.innerText = 'Withdraw';
    withdrawButton.onclick = function() {
        const withdrawalAmount = parseFloat(document.getElementById(`withdrawAmount${dayCount}`).value);
        handleWithdraw(dayCount, table, withdrawalAmount);
    };

    const withdrawMessage = document.createElement('div');
    withdrawMessage.id = `withdrawMessage${dayCount}`;
    withdrawMessage.style.marginTop = '10px';

    cell.appendChild(profitMessage);
    cell.appendChild(withdrawInput);
    cell.appendChild(withdrawButton);
    cell.appendChild(withdrawMessage);
}

function calculateTradeAnalysis() {
    tablesWrapper = document.getElementById("tablesWrapper");
    tablesWrapper.innerHTML = ""; // Clear previous content

    let currentAmount = initialAmount;
    updatedAmounts = []; // Clear updated amounts

    let table, day, perTradeAmount, resultOfTrade, totalTradesResult, totalAmount;
    let dayCount = 1;

    while (dayCount <= days) {
        if (dayCount % 30 === 1) {
            table = createTable();
            const container = document.createElement('div');
            container.classList.add('table-container');
            container.appendChild(table);
            tablesWrapper.appendChild(container);
        }

        day = `Day ${dayCount}`;
        perTradeAmount = Math.min(Math.floor((currentAmount * perTradePercentage) / 100), maxAmount);
        resultOfTrade = (perTradeAmount * resultTradePercentage) / 100;
        totalTradesResult = resultOfTrade * totalTradesTaken;
        totalAmount = currentAmount + totalTradesResult;

        addRow(table, dayCount, day, currentAmount, perTradeAmount, resultOfTrade, totalTradesResult, totalAmount);

        totalAmounts[dayCount - 1] = totalAmount;
        updatedAmounts[dayCount - 1] = totalAmount;
        labels.push(`Day ${dayCount}`);

        if (dayCount % 30 === 0) {
            addWithdrawSection(table, dayCount, totalAmount);
        }

        currentAmount = totalAmount;
        dayCount++;
    }
}

function handleWithdraw(dayCount, table, withdrawalAmount) {
    const withdrawMessage = document.getElementById(`withdrawMessage${dayCount}`);
    const profitMessage = document.getElementById(`profitMessage${dayCount}`);
    let currentAmount = updatedAmounts[dayCount - 1];

    if (currentAmount >= withdrawalAmount) {
        currentAmount -= withdrawalAmount;
        updatedAmounts[dayCount - 1] = currentAmount;

        withdrawMessage.innerHTML = `Withdrawal successful! Remaining balance: $${currentAmount.toFixed(2)}`;
        profitMessage.innerHTML = `Profit of 30 Days is: $${currentAmount.toFixed(2)}`;

        if (dayCount < days) {
            for (let i = dayCount; i < days; i++) {
                updateTableAfterWithdrawal(i + 1, currentAmount);
                currentAmount = updatedAmounts[i];
            }
        }
    } else {
        withdrawMessage.innerText = "Insufficient balance for withdrawal!";
    }
}

function updateTableAfterWithdrawal(dayCount, currentAmount) {
    const tableIndex = Math.floor((dayCount - 1) / 30);
    const rowIndex = (dayCount - 1) % 30 + 1;
    const table = tablesWrapper.children[tableIndex].children[0];

    const perTradeAmount = Math.min(Math.floor((currentAmount * perTradePercentage) / 100), maxAmount);
    const resultOfTrade = (perTradeAmount * resultTradePercentage) / 100;
    const totalTradesResult = resultOfTrade * totalTradesTaken;
    const totalAmount = currentAmount + totalTradesResult;

    table.rows[rowIndex].cells[2].innerText = currentAmount.toFixed(2);
    table.rows[rowIndex].cells[3].innerText = perTradeAmount;
    table.rows[rowIndex].cells[4].innerText = resultOfTrade.toFixed(2);
    table.rows[rowIndex].cells[5].innerText = totalTradesResult.toFixed(2);
    table.rows[rowIndex].cells[6].innerText = totalAmount.toFixed(2);

    updatedAmounts[dayCount - 1] = totalAmount;
}
