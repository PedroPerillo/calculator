const display = document.querySelector('.display-value');
const buttons = document.querySelectorAll('.btn');
const themeBtns = document.querySelectorAll('.theme-btn');

// Theme (class on html for no flash; head script sets initial state)
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-mode');
}

function setTheme(theme) {
  document.documentElement.classList.toggle('light-mode', theme === 'light');
  localStorage.setItem('theme', theme);
  themeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

// Sync active state on load
setTheme(savedTheme);

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
  const str = String(value);
  if (str.length > 9) {
    display.textContent = parseFloat(value).toExponential(4);
  } else {
    display.textContent = str;
  }
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    if (currentValue === '0' && num !== '.') {
      currentValue = num;
    } else {
      currentValue += num;
    }
  }
  updateDisplay(currentValue);
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay(currentValue);
}

function clear() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay(currentValue);
  document.querySelectorAll('.btn.operator').forEach(btn => btn.classList.remove('selected'));
}

function toggleSign() {
  if (currentValue !== '0') {
    currentValue = currentValue.startsWith('-') ? currentValue.slice(1) : '-' + currentValue;
    updateDisplay(currentValue);
  }
}

function percent() {
  currentValue = String(parseFloat(currentValue) / 100);
  updateDisplay(currentValue);
}

function calculate() {
  if (!operator || previousValue === '') return;
  
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  let result;
  
  switch (operator) {
    case '+': result = prev + curr; break;
    case '−': result = prev - curr; break;
    case '×': result = prev * curr; break;
    case '÷': result = curr === 0 ? 'Error' : prev / curr; break;
    default: return;
  }
  
  if (result === 'Error') {
    currentValue = '0';
    previousValue = '';
    operator = null;
  } else {
    currentValue = String(result);
    previousValue = '';
    operator = null;
  }
  shouldResetDisplay = true;
  updateDisplay(currentValue);
  document.querySelectorAll('.btn.operator').forEach(btn => btn.classList.remove('selected'));
}

function setOperator(op) {
  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }
  previousValue = currentValue;
  operator = op;
  shouldResetDisplay = true;
  
  document.querySelectorAll('.btn.operator').forEach(btn => btn.classList.remove('selected'));
  const activeBtn = document.querySelector(`[data-value="${op}"]`);
  if (activeBtn) activeBtn.classList.add('selected');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    
    if (action === 'number') {
      inputNumber(btn.dataset.value);
    } else if (action === 'decimal') {
      inputDecimal();
    } else if (action === 'clear') {
      clear();
    } else if (action === 'toggle') {
      toggleSign();
    } else if (action === 'percent') {
      percent();
    } else if (action === 'operator') {
      setOperator(btn.dataset.value);
    } else if (action === 'equals') {
      calculate();
    }
  });
});
