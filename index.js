const STORAGE_KEY = "kakeiboEntries";

const form = document.querySelector("form");
const dateInput = document.querySelector("#entry-date");
const itemInput = document.querySelector("#entry-item");
const typeInputs = document.querySelectorAll('input[name="entry-type"]');
const amountInput = document.querySelector("#entry-amount");
const tableBody = document.querySelector("table tbody");
const totalElement = document.querySelector(".summary-panel strong");

let entries = loadEntries();

function loadEntries() {
  const savedEntries = localStorage.getItem(STORAGE_KEY);

  if (!savedEntries) {
    return [];
  }

  try {
    const parsedEntries = JSON.parse(savedEntries);
    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getSelectedType() {
  return [...typeInputs].find((input) => input.checked).value;
}

function renderEntries() {
  tableBody.replaceChildren();

  if (entries.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.textContent = "登録されたデータはありません。";
    emptyRow.append(emptyCell);
    tableBody.append(emptyRow);
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const itemCell = document.createElement("td");
    const typeCell = document.createElement("td");
    const amountCell = document.createElement("td");

    dateCell.textContent = entry.date;
    itemCell.textContent = entry.item;
    typeCell.textContent = entry.type === "income" ? "収入" : "支出";
    amountCell.textContent = `${entry.amount.toLocaleString("ja-JP")}円`;

    row.append(dateCell, itemCell, typeCell, amountCell);
    tableBody.append(row);
  });
}

function renderTotal() {
  const total = entries.reduce((sum, entry) => {
    return entry.type === "income" ? sum + entry.amount : sum - entry.amount;
  }, 0);

  totalElement.textContent = `${total.toLocaleString("ja-JP")}円`;
}

function render() {
  renderEntries();
  renderTotal();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const entry = {
    id: crypto.randomUUID(),
    date: dateInput.value,
    item: itemInput.value.trim(),
    type: getSelectedType(),
    amount: Number(amountInput.value),
  };

  entries.push(entry);
  saveEntries();
  render();
  form.reset();
});

render();
