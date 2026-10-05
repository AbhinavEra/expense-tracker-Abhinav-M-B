/* =========================================
   EXPENSE TRACKER
   ========================================= */


/* =========================================
   GET HTML ELEMENTS
   ========================================= */

const transactionForm =
    document.getElementById("transaction-form");

const typeInput =
    document.getElementById("type");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const transactionList =
    document.getElementById("transaction-list");

const totalIncome =
    document.getElementById("total-income");

const totalExpenses =
    document.getElementById("total-expenses");

const currentBalance =
    document.getElementById("current-balance");

const errorMessage =
    document.getElementById("error-message");

const submitButton =
    document.getElementById("submit-button");

const filterType =
    document.getElementById("filter-type");

const filterCategory =
    document.getElementById("filter-category");

const monthlySummaryContent =
    document.getElementById("monthly-summary-content");

const selectedMonthElement =
    document.getElementById("selected-month");

const previousMonthButton =
    document.getElementById("previous-month");

const nextMonthButton =
    document.getElementById("next-month");

const exportButton =
    document.getElementById("export-button");

const clearButton =
    document.getElementById("clear-button");


/* =========================================
   GLOBAL VARIABLES
   ========================================= */

let transactions = [];

let editingId = null;

let expenseChart = null;


/*
   The month currently selected in
   Monthly Summary.

   JavaScript months:
   0 = January
   1 = February
   ...
   11 = December
*/

let selectedMonth;
let selectedYear;


/* =========================================
   LOAD TRANSACTIONS
   ========================================= */

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem(
            "expenseTrackerTransactions"
        );

    if (savedTransactions) {

        transactions =
            JSON.parse(savedTransactions);

    } else {

        transactions = [];

    }
}


/* =========================================
   SAVE TRANSACTIONS
   ========================================= */

function saveTransactions() {

    localStorage.setItem(
        "expenseTrackerTransactions",
        JSON.stringify(transactions)
    );
}


/* =========================================
   FORMAT MONEY
   ========================================= */

function formatMoney(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


/* =========================================
   GET TODAY AS YYYY-MM-DD
   ========================================= */

/*
   We build the date manually instead of using
   toISOString() so the browser's UTC conversion
   cannot shift the displayed date.
*/

function getTodayDateString() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================
   PARSE DATE WITHOUT UTC SHIFT
   ========================================= */

/*
   Converts:

   "2026-10-05"

   into a local Date object.

   This avoids timezone surprises when
   calculating monthly summaries.
*/

function parseLocalDate(dateString) {

    const parts =
        dateString.split("-");

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);

    return new Date(
        year,
        month - 1,
        day
    );
}


/* =========================================
   UPDATE OVERALL SUMMARY
   ========================================= */

function updateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        function(transaction) {

            if (transaction.type === "income") {

                income +=
                    Number(transaction.amount);

            }

            else if (transaction.type === "expense") {

                expenses +=
                    Number(transaction.amount);

            }

        }
    );


    const balance =
        income - expenses;


    totalIncome.textContent =
        formatMoney(income);

    totalExpenses.textContent =
        formatMoney(expenses);

    currentBalance.textContent =
        formatMoney(balance);


    /*
       Make negative balance red.
    */

    if (balance < 0) {

        currentBalance.classList.add(
            "negative-balance"
        );

    }

    else {

        currentBalance.classList.remove(
            "negative-balance"
        );

    }
}


/* =========================================
   DISPLAY TRANSACTIONS
   ========================================= */

function displayTransactions() {

    transactionList.innerHTML = "";


    let filteredTransactions =
        transactions.filter(
            function(transaction) {

                const typeMatches =
                    filterType.value === "all" ||
                    transaction.type ===
                    filterType.value;


                const categoryMatches =
                    filterCategory.value === "all" ||
                    transaction.category ===
                    filterCategory.value;


                return (
                    typeMatches &&
                    categoryMatches
                );

            }
        );


    /*
       Show newest transactions first.
    */

    filteredTransactions.sort(
        function(a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        }
    );


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p id="empty-message">
                No transactions found.
            </p>
        `;

        return;
    }


    filteredTransactions.forEach(
        function(transaction) {

            const transactionElement =
                document.createElement("div");


            transactionElement.classList.add(
                "transaction-item"
            );


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const amountClass =
                transaction.type === "income"
                    ? "income"
                    : "expense";


            transactionElement.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${transaction.description}
                    </h3>

                    <p>
                        ${transaction.category}
                        |
                        ${transaction.type}
                    </p>

                    <p class="transaction-date">
                        ${transaction.date}
                    </p>

                    <div class="transaction-actions">

                        <button
                            class="edit-button"
                            onclick="editTransaction(${transaction.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-button"
                            onclick="deleteTransaction(${transaction.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>


                <div
                    class="transaction-amount ${amountClass}"
                >
                    ${sign}${formatMoney(
                        transaction.amount
                    )}
                </div>

            `;


            transactionList.appendChild(
                transactionElement
            );

        }
    );
}


/* =========================================
   VALIDATE FORM
   ========================================= */

function validateForm() {

    errorMessage.textContent = "";


    const type =
        typeInput.value;


    const amount =
        Number(amountInput.value);


    const category =
        categoryInput.value;


    const date =
        dateInput.value;


    const description =
        descriptionInput.value.trim();


    if (type === "") {

        errorMessage.textContent =
            "Please select a transaction type.";

        return false;
    }


    if (
        amount <= 0 ||
        isNaN(amount)
    ) {

        errorMessage.textContent =
            "Please enter a valid amount.";

        return false;
    }


    if (category === "") {

        errorMessage.textContent =
            "Please select a category.";

        return false;
    }


    if (date === "") {

        errorMessage.textContent =
            "Please select a date.";

        return false;
    }


    if (description === "") {

        errorMessage.textContent =
            "Please enter a description.";

        return false;
    }


    return true;
}


/* =========================================
   ADD / UPDATE TRANSACTION
   ========================================= */

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (!validateForm()) {

            return;
        }


        const type =
            typeInput.value;


        const amount =
            Number(amountInput.value);


        const category =
            categoryInput.value;


        const date =
            dateInput.value;


        const description =
            descriptionInput.value.trim();


        /* =========================
           UPDATE EXISTING
           ========================= */

        if (editingId !== null) {

            const transaction =
                transactions.find(
                    function(item) {

                        return item.id ===
                            editingId;

                    }
                );


            if (transaction) {

                transaction.type =
                    type;

                transaction.amount =
                    amount;

                transaction.category =
                    category;

                transaction.date =
                    date;

                transaction.description =
                    description;

            }


            editingId = null;

            submitButton.textContent =
                "Add Transaction";

            transactionForm.classList.remove(
                "edit-mode"
            );

        }


        /* =========================
           ADD NEW
           ========================= */

        else {

            const newTransaction = {

                id: Date.now(),

                type: type,

                amount: amount,

                category: category,

                date: date,

                description: description

            };


            transactions.push(
                newTransaction
            );

        }


        saveTransactions();


        updateSummary();

        displayTransactions();

        updateMonthlySummary();

        updateExpenseChart();


        transactionForm.reset();


        errorMessage.textContent = "";


        setTodayDate();


        /*
           If a new transaction was entered
           into a different month, keep the
           currently selected month.

           The user can navigate to it using
           the month buttons.
        */

        updateMonthNavigation();

    }
);


/* =========================================
   EDIT TRANSACTION
   ========================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!transaction) {

        return;
    }


    typeInput.value =
        transaction.type;


    amountInput.value =
        transaction.amount;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    descriptionInput.value =
        transaction.description;


    editingId = id;


    submitButton.textContent =
        "Update Transaction";


    transactionForm.classList.add(
        "edit-mode"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   DELETE TRANSACTION
   ========================================= */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;
    }


    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();


    updateSummary();

    displayTransactions();

    updateMonthlySummary();

    updateExpenseChart();

    updateMonthNavigation();

}


/* =========================================
   FILTER EVENTS
   ========================================= */

filterType.addEventListener(
    "change",
    function() {

        displayTransactions();

    }
);


filterCategory.addEventListener(
    "change",
    function() {

        displayTransactions();

    }
);


/* =========================================
   GET CURRENT MONTH/YEAR
   ========================================= */

function setCurrentMonth() {

    const today =
        new Date();


    selectedMonth =
        today.getMonth();


    selectedYear =
        today.getFullYear();

}


/* =========================================
   GET EARLIEST TRANSACTION MONTH
   ========================================= */

function getEarliestTransactionMonth() {

    if (transactions.length === 0) {

        const today =
            new Date();

        return {
            month: today.getMonth(),
            year: today.getFullYear()
        };
    }


    let earliestDate =
        parseLocalDate(
            transactions[0].date
        );


    transactions.forEach(
        function(transaction) {

            const transactionDate =
                parseLocalDate(
                    transaction.date
                );


            if (
                transactionDate <
                earliestDate
            ) {

                earliestDate =
                    transactionDate;

            }

        }
    );


    return {

        month:
            earliestDate.getMonth(),

        year:
            earliestDate.getFullYear()

    };

}


/* =========================================
   CHECK IF MONTH IS EARLIER
   ========================================= */

function isBeforeMonth(
    month,
    year,
    targetMonth,
    targetYear
) {

    if (year < targetYear) {

        return true;
    }


    if (
        year === targetYear &&
        month < targetMonth
    ) {

        return true;
    }


    return false;
}


/* =========================================
   CHECK IF MONTH IS AFTER
   ========================================= */

function isAfterMonth(
    month,
    year,
    targetMonth,
    targetYear
) {

    if (year > targetYear) {

        return true;
    }


    if (
        year === targetYear &&
        month > targetMonth
    ) {

        return true;
    }


    return false;
}


/* =========================================
   UPDATE MONTH NAVIGATION
   ========================================= */

function updateMonthNavigation() {

    const earliest =
        getEarliestTransactionMonth();


    const today =
        new Date();


    const currentMonth =
        today.getMonth();


    const currentYear =
        today.getFullYear();


    /*
       Disable Previous if we are already
       at the earliest transaction month.
    */

    const cannotGoPrevious =
        isBeforeMonth(
            selectedMonth,
            selectedYear,
            earliest.month,
            earliest.year
        );


    /*
       Disable Next if we are already
       at the current month.
    */

    const cannotGoNext =
        isAfterMonth(
            selectedMonth,
            selectedYear,
            currentMonth,
            currentYear
        ) ||
        (
            selectedMonth === currentMonth &&
            selectedYear === currentYear
        );


    previousMonthButton.disabled =
        cannotGoPrevious;


    nextMonthButton.disabled =
        cannotGoNext;

}


/* =========================================
   DISPLAY SELECTED MONTH
   ========================================= */

function displaySelectedMonth() {

    const monthDate =
        new Date(
            selectedYear,
            selectedMonth,
            1
        );


    const monthName =
        monthDate.toLocaleString(
            "en-IN",
            {
                month: "long"
            }
        );


    selectedMonthElement.textContent =
        `${monthName} ${selectedYear}`;

}


/* =========================================
   UPDATE MONTHLY SUMMARY
   ========================================= */

function updateMonthlySummary() {

    let monthlyIncome = 0;

    let monthlyExpenses = 0;


    transactions.forEach(
        function(transaction) {

            const transactionDate =
                parseLocalDate(
                    transaction.date
                );


            const transactionMonth =
                transactionDate.getMonth();


            const transactionYear =
                transactionDate.getFullYear();


            if (
                transactionMonth ===
                    selectedMonth &&
                transactionYear ===
                    selectedYear
            ) {

                if (
                    transaction.type ===
                    "income"
                ) {

                    monthlyIncome +=
                        Number(
                            transaction.amount
                        );

                }


                else if (
                    transaction.type ===
                    "expense"
                ) {

                    monthlyExpenses +=
                        Number(
                            transaction.amount
                        );

                }

            }

        }
    );


    const monthlyBalance =
        monthlyIncome -
        monthlyExpenses;


    /*
       Display month and year.
    */

    displaySelectedMonth();


    /*
       Display monthly cards.
    */

    monthlySummaryContent.innerHTML = `

        <div class="monthly-card">

            <h3>
                Monthly Income
            </h3>

            <p class="income">
                ${formatMoney(
                    monthlyIncome
                )}
            </p>

        </div>


        <div class="monthly-card">

            <h3>
                Monthly Expenses
            </h3>

            <p class="expense">
                ${formatMoney(
                    monthlyExpenses
                )}
            </p>

        </div>


        <div class="monthly-card">

            <h3>
                Monthly Balance
            </h3>

            <p class="balance">
                ${formatMoney(
                    monthlyBalance
                )}
            </p>

        </div>

    `;


    /*
       Update Previous/Next buttons.
    */

    updateMonthNavigation();

}


/* =========================================
   PREVIOUS MONTH
   ========================================= */

previousMonthButton.addEventListener(
    "click",
    function() {

        /*
           If January, move to December
           of the previous year.
        */

        if (selectedMonth === 0) {

            selectedMonth = 11;

            selectedYear--;

        }

        else {

            selectedMonth--;

        }


        updateMonthlySummary();

    }
);


/* =========================================
   NEXT MONTH
   ========================================= */

nextMonthButton.addEventListener(
    "click",
    function() {

        /*
           If December, move to January
           of the next year.
        */

        if (selectedMonth === 11) {

            selectedMonth = 0;

            selectedYear++;

        }

        else {

            selectedMonth++;

        }


        updateMonthlySummary();

    }
);


/* =========================================
   SET TODAY'S DATE
   ========================================= */

function setTodayDate() {

    dateInput.value =
        getTodayDateString();

}


/* =========================================
   CLEAR ALL TRANSACTIONS
   ========================================= */

clearButton.addEventListener(
    "click",
    function() {

        if (transactions.length === 0) {

            alert(
                "There are no transactions to clear."
            );

            return;
        }


        const confirmClear =
            confirm(
                "Are you sure you want to delete ALL transactions?"
            );


        if (!confirmClear) {

            return;
        }


        transactions = [];


        saveTransactions();


        /*
           Return Monthly Summary to
           the current month.
        */

        setCurrentMonth();


        updateSummary();

        displayTransactions();

        updateMonthlySummary();

        updateExpenseChart();

        updateMonthNavigation();


        alert(
            "All transactions have been deleted."
        );

    }
);


/* =========================================
   EXPORT CSV
   ========================================= */

    exportButton.addEventListener("click", function() {

    if (transactions.length === 0) {
        alert("There are no transactions to export.");
        return;
    }

    let csv =
        "Type,Amount,Category,Date,Description\n";

    transactions.forEach(function(transaction) {

        // Convert YYYY-MM-DD to DD/MM/YYYY
        const dateParts = transaction.date.split("-");

        const formattedDate =
            dateParts[2] + "/" +
            dateParts[1] + "/" +
            dateParts[0];

        const row = [
            transaction.type,
            transaction.amount,
            transaction.category,

            // Keep the date as text in the CSV
            `"${formattedDate}"`,

            `"${transaction.description.replace(/"/g, '""')}"`
        ];

        csv += row.join(",") + "\n";
    });

        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "expense_tracker.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    });


/* =========================================
   UPDATE EXPENSE CHART
   ========================================= */

function updateExpenseChart() {

    const categoryTotals = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const category = transaction.category;
            const amount = Number(transaction.amount);

            if (categoryTotals[category]) {
                categoryTotals[category] += amount;
            } else {
                categoryTotals[category] = amount;
            }
        }
    });


    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);


    if (expenseChart !== null) {
        expenseChart.destroy();
        expenseChart = null;
    }


    if (categories.length === 0) {
        return;
    }


    const totalExpenses = amounts.reduce(function(total, amount) {
        return total + amount;
    }, 0);


    const chartCanvas = document.getElementById("expense-chart");


    expenseChart = new Chart(chartCanvas, {

        type: "doughnut",

        data: {
            labels: categories,

            datasets: [{
                label: "Expenses",
                data: amounts
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        generateLabels: function(chart) {

                            const data = chart.data;

                            if (!data.labels.length) {
                                return [];
                            }

                            return data.labels.map(function(label, index) {

                                const amount = data.datasets[0].data[index];

                                const percentage =
                                    ((amount / totalExpenses) * 100).toFixed(1);

                                return {
                                    text: label + " — " + percentage + "%",
                                    fillStyle:
                                        data.datasets[0].backgroundColor[index],
                                    strokeStyle:
                                        data.datasets[0].borderColor
                                            ? data.datasets[0].borderColor[index]
                                            : undefined,
                                    lineWidth: 1,
                                    hidden:
                                        !chart.getDataVisibility(index),
                                    index: index
                                };

                            });
                        }
                    }
                },


                tooltip: {

                    callbacks: {

                        label: function(context) {

                            const value = context.raw;

                            const percentage =
                                ((value / totalExpenses) * 100).toFixed(1);

                            return (
                                " ₹" +
                                Number(value).toLocaleString("en-IN") +
                                " (" +
                                percentage +
                                "%)"
                            );
                        }
                    }
                }
            }
        }
    });
}





/* =========================================
   INITIALIZE APPLICATION
   ========================================= */

function initializeApp() {

    /*
       Load saved data.
    */

    loadTransactions();


    /*
       Start Monthly Summary at
       the current month.
    */

    setCurrentMonth();


    /*
       Update everything.
    */

    updateSummary();

    displayTransactions();

    updateMonthlySummary();

    updateExpenseChart();

    setTodayDate();

}


/* =========================================
   START APPLICATION
   ========================================= */

initializeApp();