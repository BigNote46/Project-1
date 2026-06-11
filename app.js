// ==========================================
// 1. ดึง Elements ต่างๆ จากหน้า HTML มาเก็บไว้ในตัวแปร
// ==========================================
const incomeInput = document.getElementById('income-input');
const saveIncomeBtn = document.getElementById('save-income-btn');
const totalIncomeDisplay = document.getElementById('total-income-display');
const savingsDisplay = document.getElementById('savings-display');
const budgetLeftDisplay = document.getElementById('budget-left-display');

const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');
const noDataAlert = document.getElementById('no-data-alert');

// ==========================================
// 2. สร้างตัวแปรเก็บสถานะ (State) และดึงข้อมูลเก่าจาก LocalStorage
// ==========================================
// ถ้ามีข้อมูลเก่าให้ดึงมาใช้ ถ้าไม่มีให้เริ่มจาก 0 หรืออาร์เรย์ว่าง []
let currentIncome = parseFloat(localStorage.getItem('currentIncome')) || 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// ==========================================
// 3. ฟังก์ชันคำนวณและอัปเดตหน้าจอด้านบน (Dashboard)
// ==========================================
function updateDashboard() {
    // คำนวณรายจ่ายทั้งหมดจากอาร์เรย์ expenses
    let totalExpense = 0;
    expenses.forEach(item => {
        totalExpense += item.amount;
    });

    const savings = currentIncome * 0.2;
    const usableBudget = currentIncome * 0.8;
    const budgetLeft = usableBudget - totalExpense;

    totalIncomeDisplay.innerText = `${currentIncome.toLocaleString()} ฿`;
    savingsDisplay.innerText = `${savings.toLocaleString()} ฿`;
    budgetLeftDisplay.innerText = `${budgetLeft.toLocaleString()} ฿`;

    if (budgetLeft < 0) {
        budgetLeftDisplay.classList.remove('text-warning');
        budgetLeftDisplay.classList.add('text-danger');
    } else {
        budgetLeftDisplay.classList.add('text-warning');
        budgetLeftDisplay.classList.remove('text-danger');
    }
}

// ==========================================
// 4. ฟังก์ชันแสดงรายการรายจ่ายออกทางหน้าจอ (Render Expenses)
// ==========================================
function renderExpenses() {
    expenseList.innerHTML = ''; // ล้างข้อมูลเก่าในตารางก่อนพิมพ์ใหม่

    if (expenses.length === 0) {
        noDataAlert.style.display = 'block';
        return;
    }

    noDataAlert.style.display = 'none';

    // วนลูปเอาข้อมูลจากอาร์เรย์ออกมาสร้างเป็นแถวตาราง
    expenses.forEach((item, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td class="text-danger fw-bold">-${item.amount.toLocaleString()} ฿</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        expenseList.appendChild(newRow);
    });
}

// ==========================================
// 5. ฟังก์ชันสำหรับบันทึกข้อมูลลง LocalStorage
// ==========================================
function saveToLocalStorage() {
    localStorage.setItem('currentIncome', currentIncome);
    localStorage.setItem('expenses', JSON.stringify(expenses)); // แปลงอาร์เรย์เป็นตัวหนังสือเซฟลงเครื่อง
}

// ==========================================
// 6. สั่งให้ปุ่ม "บันทึกรายได้" ทำงาน
// ==========================================
saveIncomeBtn.addEventListener('click', function() {
    const incomeValue = parseFloat(incomeInput.value);

    if (isNaN(incomeValue) || incomeValue <= 0) {
        alert('กรุณากรอกจำนวนรายได้ให้ถูกต้องครับ');
        return;
    }

    currentIncome = incomeValue;
    incomeInput.value = '';
    
    saveToLocalStorage(); // เซฟลงเครื่อง
    updateDashboard(); // อัปเดตตัวเลข
});

// ==========================================
// 7. สั่งให้ปุ่ม "เพิ่มรายการรายจ่าย" ทำงาน
// ==========================================
addExpenseBtn.addEventListener('click', function() {
    const name = expenseName.value;
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;

    if (name.trim() === '' || isNaN(amount) || amount <= 0) {
        alert('กรุณากรอกข้อมูลรายจ่ายให้ครบถ้วนครับ');
        return;
    }

    // สร้างอ็อบเจกต์รายจ่ายใหม่
    const newExpense = {
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(newExpense); // เพิ่มเข้าไปในอาร์เรย์หลัก

    expenseName.value = '';
    expenseAmount.value = '';

    saveToLocalStorage(); // เซฟลงเครื่อง
    renderExpenses();     // วาดตารางใหม่
    updateDashboard();    // อัปเดตตัวเลข
});

// ==========================================
// 8. ฟังก์ชันสำหรับลบรายจ่าย (เมื่อกดปุ่มถังขยะ)
// ==========================================
function deleteExpense(index) {
    expenses.splice(index, 1); // ลบข้อมูลในอาร์เรย์ตามตำแหน่ง (index) ที่กด
    
    saveToLocalStorage(); // เซฟข้อมูลที่อัปเดตแล้วลงเครื่อง
    renderExpenses();     // วาดตารางใหม่
    updateDashboard();    // อัปเดตตัวเลข
}

// ==========================================
// 9. โหลดข้อมูลมาแสดงทันทีเมื่อเปิดเว็บครั้งแรก
// ==========================================
updateDashboard();
renderExpenses();