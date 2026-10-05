# expense-tracker-Abhinav-M-B


# 💰 Expense Tracker

A responsive and user-friendly web application for managing personal income and expenses. The application allows users to record transactions, monitor their financial balance, analyze spending by category, and review monthly financial activity — all directly in the browser.

Built using **HTML, CSS, and JavaScript**, with **Local Storage** for persistent data and **Chart.js** for expense visualization.
<img width="1920" height="926" alt="image" src="https://github.com/user-attachments/assets/4d88edf5-d596-40d9-966f-d0fdb4e4d93b" />


---

## ✨ Features

### 💵 Income & Expense Management

- Add income and expense transactions
- Select transaction type
- Enter transaction amount
- Select a category
- Choose transaction date
- Add a transaction description
- Edit existing transactions
- Delete individual transactions

<img width="1400" height="593" alt="image" src="https://github.com/user-attachments/assets/13f459c5-ef04-40b1-a619-76675994efa3" />


### 📊 Financial Summary

The dashboard provides an overview of:

- **Total Income** – Total amount of money received
- **Total Expenses** – Total amount spent
- **Current Balance** – Income minus expenses

The balance is automatically updated whenever a transaction is added, edited, or deleted.

<img width="1445" height="248" alt="image" src="https://github.com/user-attachments/assets/ace2c52c-3f0d-4b2c-8374-2ec8e6b4fad2" />


### 🔎 Transaction Filtering

Transactions can be filtered based on:

- Transaction type
  - All
  - Income
  - Expense
- Category
  - Salary
  - Food
  - Transport
  - Shopping
  - Bills
  - Entertainment
  - Health
  - Education
  - Other

<img width="1412" height="557" alt="image" src="https://github.com/user-attachments/assets/ae901bad-853e-433b-95a1-03335e3a2ffd" />

<img width="1417" height="793" alt="image" src="https://github.com/user-attachments/assets/131a2921-165f-40eb-a0bf-e5b454552ade" />


This makes it easier to find and review specific transactions.

### 📅 Monthly Summary

The application provides a monthly financial summary showing:

- Monthly Income
- Monthly Expenses
- Monthly Balance

Users can navigate between available months using the **Previous** and **Next** controls.

<img width="1433" height="383" alt="image" src="https://github.com/user-attachments/assets/a66ef607-921e-4ff4-a754-ae1ce1e19b6d" />


### 🍩 Expense Visualization

A doughnut chart provides a visual breakdown of expenses by category.

The chart displays:

- Expense categories
- Relative spending distribution
- Percentage contribution of each category
- Expense amount when hovering over a category

This helps users quickly understand where their money is being spent.

<img width="1398" height="788" alt="image" src="https://github.com/user-attachments/assets/307df9ac-d0fc-4a66-bbf1-fb140786fd56" />


### 💾 Local Storage

Transaction data is stored using the browser's **Local Storage**.

This means:

- Data remains available after refreshing the page
- No backend server or database is required
- The application works entirely on the client side

### 📥 CSV Export

Users can export their transaction data as a CSV file for:

- Backup
- Further analysis
- Opening in Microsoft Excel or Google Sheets

### 🗑️ Clear All Transactions

A **Clear All** option is available to remove all stored transactions after confirmation.

### 📱 Responsive Design

The interface is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile devices
- 📟 Tablet-sized screens

The layout automatically adapts to smaller screen sizes for easier use.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Application structure |
| **CSS3** | Styling, layout and responsive design |
| **JavaScript** | Application logic and interactivity |
| **Local Storage API** | Persistent transaction storage |
| **Chart.js** | Expense category visualization |

---

## 📁 Project Structure

```text
expense-tracker/
│
├── index.html      # Main application interface
├── style.css       # Application styling and responsive layout
├── script.js       # Application logic and functionality
└── README.md       # Project documentation
```

## 🚀 **How to Run the Application**

This is a client-side web application, so no server, database, or package installation is required.

**Option 1: Open Directly in Browser**
1. Download or clone the repository.
2. Open the project folder:
   ```text
   expense-tracker/
   ```
3. Double-click:
   ```text
   index.html
   ```
4. The application will open in your default web browser.
---
**Option 2: Run Using VS Code**

For development, it is recommended to use Visual Studio Code with the Live Server extension.
1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Right-click ```text index.html ```
5. Select:
   ```text
   Open with Live Server
   ```
6. The Expense Tracker will open in your browser.
---

**🧭 How to Use**

**1.Add a Transaction**

Fill in:
- Transaction Type
- Amount
- Category
- Date
- Description

Then click:
```text
Add Transaction
```
The transaction will immediately appear in the transaction list.

---
**2.View Your Financial Summary**

The dashboard automatically calculates:
```text
Total Income
Total Expenses
Current Balance
```
The balance is calculated as:
```text
Current Balance = Total Income - Total Expenses
```

---

**3.Filter Transactions**

Use the filter controls to display:

- All transactions
- Only income
- Only expenses
- Transactions from a specific category

---

**4.Edit a Transaction**

Click the Edit button beside a transaction.

The existing information will be loaded into the form.

Modify the required fields and select:
```text
Update Transaction
```

---

**5.Delete a Transaction**

Click Delete beside the transaction you want to remove.

A confirmation message will appear before the transaction is permanently removed.

---

**6.Analyze Monthly Spending**

Use the Monthly Summary section to navigate through months and view:

- Monthly income
- Monthly expenses
- Monthly balance

---

**7.Analyze Expenses by Category**

The Expense by Category doughnut chart provides a visual representation of spending.

For example:

```text
Food          20%
Transport     35%
Shopping      25%
Entertainment 20%
```

The values are calculated automatically from the recorded expense transactions.

---

**8.Export Transactions**

Click:

```text
Export CSV
```

to download your transaction records as:

```text
expense_tracker.csv
```

The exported file can be opened using spreadsheet applications such as Microsoft Excel or Google Sheets.

---

**💡 Key Implementation Details**

**Client-Side Application**

The application runs entirely in the browser and does not require a backend server.

**Persistent Data**

Transactions are stored in:

```text
localStorage
```

under the application's storage key.

**Automatic Calculations**

Income, expenses, balance, monthly totals, and category-wise expenses are recalculated whenever transaction data changes.

**Dynamic Visualization**

The expense chart is generated dynamically using Chart.js based on the user's recorded expense data.

---

**🎯 Project Objectives**

This project was developed to demonstrate practical implementation of:

- Front-end web development
- HTML semantic structure
- CSS responsive design
- JavaScript DOM manipulation
- Form handling and validation
- CRUD operations
- Browser Local Storage
- Dynamic data visualization
- Data filtering
- CSV generation
- Responsive UI design
