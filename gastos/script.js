// Referencias a elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const expenseList = document.getElementById('expense-list');
const emptyMsg = document.getElementById('empty-msg');
const filterCategory = document.getElementById('filter-category');

const totalAmountEl = document.getElementById('total-amount');
const maxExpenseEl = document.getElementById('max-expense');
const totalCountEl = document.getElementById('total-count');

// Establecer la fecha actual por defecto en el input date
dateInput.valueAsDate = new Date();

// Obtener gastos de localStorage o inicializar array vacío
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// --- Funciones principales ---

// Guardar en LocalStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Formatear montos a moneda local
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

// Actualizar el resumen (Total, Maximo, Cantidad)
function updateSummary() {
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);
    const max = expenses.length > 0 ? Math.max(...expenses.map(item => item.amount)) : 0;

    totalAmountEl.textContent = formatCurrency(total);
    maxExpenseEl.textContent = formatCurrency(max);
    totalCountEl.textContent = expenses.length;
}

// Renderizar la lista de gastos
function renderExpenses() {
    expenseList.innerHTML = '';
    
    const selectedFilter = filterCategory.value;
    const filteredExpenses = selectedFilter === 'todas' 
        ? expenses 
        : expenses.filter(exp => exp.category === selectedFilter);

    if (filteredExpenses.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        
        // Ordenar gastos por fecha descendente (más recientes primero)
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredExpenses.forEach(expense => {
            const li = document.createElement('li');
            li.classList.add('expense-item');
            
            li.innerHTML = `
                <div class="expense-info">
                    <h4>${expense.description}</h4>
                    <div class="details">
                        <span class="badge">${expense.category}</span> | ${expense.date}
                    </div>
                </div>
                <div class="expense-amount">
                    <span class="amount">-${formatCurrency(expense.amount)}</span>
                    <button class="btn-delete" onclick="deleteExpense(${expense.id})">✕</button>
                </div>
            `;

            expenseList.appendChild(li);
        });
    }

    updateSummary();
}

// Agregar un nuevo gasto
function addExpense(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!description || isNaN(amount) || !category || !date) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const newExpense = {
        id: Date.now(), // ID único basado en el timestamp
        description,
        amount,
        category,
        date
    };

    expenses.push(newExpense);
    saveExpenses();
    renderExpenses();

    // Limpiar formulario manteniéndolo listo para el siguiente uso
    expenseForm.reset();
    dateInput.valueAsDate = new Date();
}

// Eliminar un gasto por ID
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
}

// --- Event Listeners ---
expenseForm.addEventListener('submit', addExpense);
filterCategory.addEventListener('change', renderExpenses);

// Inicializar vista al cargar la página
renderExpenses();