import './main.css'

const state = {
    displayValue: '0',
    oldNum: null,
    curNum: null,
    waitingForCurNum: false,
    operator: null,
    prevOperator: null,
    holdNegative: false
};

const updateDisplay = () => {
    const { displayValue } = state
    document.getElementById('display').textContent = displayValue;
}

const putNumber = (num) => {
    const { displayValue, waitingForCurNum, holdNegative } = state
    if (waitingForCurNum) {
        state.displayValue = holdNegative ? '-' + num : num
        state.waitingForCurNum = false
        state.holdNegative = false
    } else {
        state.displayValue = displayValue === '0' ? num : displayValue + num
    }
}

const decimal = () => {
    if (state.waitingForCurNum === true) {
        state.displayValue = '0.'
        state.waitingForCurNum = false;
        return
    }

    if (!state.displayValue.toString().includes('.')) {
        state.displayValue += '.'
    }
}

const clear = () => {
    state.displayValue = '0';
    state.oldNum = null;
    state.curNum = null;
    state.waitingForCurNum = false;
    state.operator = null;
    state.prevOperator = null;
    state.holdNegative = false;
}

const handleOperator = (nextOperator) => {
    const { oldNum, displayValue, operator, prevOperator, curNum } = state
    const inputValue = parseFloat(displayValue)
    if (operator === 'multiply' && state.waitingForCurNum) {
        switch (nextOperator) {
            case 'subtract':
                state.holdNegative = true
                state.operator = operator
                return
            case 'add':
                state.holdNegative = false
                state.operator = nextOperator
                return
        }
    }
    if (operator === 'equals') {
        state.waitingForCurNum = false
    }
    if (operator && state.waitingForCurNum) {
        state.operator = nextOperator;
        return;
    }

    if (oldNum === null && !isNaN(inputValue)) {
        state.oldNum = inputValue
    } else if (operator !== 'equals') {
        const totalNum = calculate(oldNum, inputValue, operator)
        state.displayValue = `${parseFloat(totalNum.toFixed(7))}`;
        state.oldNum = totalNum
        if (operator !== 'equals') {
            state.prevOperator = operator
            state.curNum = inputValue
        }
    } else if (operator === 'equals') {
        const totalNum = calculate(inputValue, curNum, prevOperator)
        state.displayValue = `${parseFloat(totalNum.toFixed(7))}`;
    }

    state.waitingForCurNum = true
    state.operator = nextOperator
}

const calculate = (oldNum, curNum, operator) => {
    switch (operator) {
        case 'add':
            return oldNum + curNum
        case 'subtract':
            return oldNum - curNum
        case 'multiply':
            return oldNum * curNum
        case 'divide':
            return oldNum / curNum
        default:
            return curNum
    }
}

document.querySelector('.bodyBox').addEventListener('click', (e) => {
    const { id: buttonID, value: numValue } = e.target;

    switch (buttonID) {
        case 'clear':
            clear()
            break;
        case 'decimal':
            decimal()
            break;
        case 'equals':
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            handleOperator(buttonID)
            break;
        default:
            if (Number.isInteger(parseFloat(numValue))) {
                putNumber(numValue)
            }
            break;
    }
    updateDisplay()
})