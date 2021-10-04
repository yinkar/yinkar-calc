const operationsEnum = {
    PLUS: 0,
    MINUS: 1,
    MULTIPLY: 2,
    DIVIDE: 3
};

const operands = {
    first: null,
    last: null
};

let currentOperation = null;

// Screen elements
const opsElement = document.querySelector('.screen > .operations');

const firstOperandElement = opsElement.querySelector('.first');
const operationElement = opsElement.querySelector('.operation');
const lastOperandElement = opsElement.querySelector('.last');

const accElement = document.querySelector('.screen > .accumulator');
const prevElement = document.querySelector('.screen > .previous-operands');

// Keypad buttons
const keys = document.querySelectorAll('.keypad button');

// Key events
keys.forEach(e => {
    e.addEventListener('click', function(e) {
        // Operations and actions
        switch (this.dataset.action) {
            // Typing numbers
            case 'num':
                prevElement.innerText = '';
                
                if (currentOperation === null && firstOperandElement.innerText.length < 9) {
                    firstOperandElement.innerText += this.dataset.number;
                }
                else if (currentOperation !== null && lastOperandElement.innerText.length < 9) {
                    lastOperandElement.innerText += this.dataset.number;
                }
                break;
            
            // Calculate result
            case 'equals':
                if (lastOperandElement.innerText.length > 0) {
                    operands.last = parseFloat(lastOperandElement.innerText);

                    let result;

                    // Arithmetic operations
                    switch (currentOperation) {
                        case operationsEnum.PLUS:
                            result = sum(operands.first, operands.last);
                            break;
                        case operationsEnum.MINUS:
                            result = sub(operands.first, operands.last);
                            break;
                        case operationsEnum.MULTIPLY:
                            result = mul(operands.first, operands.last);
                            break;
                        case operationsEnum.DIVIDE:
                            result = div(operands.first, operands.last);
                            break;
                        default:
                            result = 0;
                    }

                    prevElement.innerText = `${
                        firstOperandElement.innerText
                    } ${
                        operationElement.innerText
                    } ${
                        lastOperandElement.innerText
                    }`;

                    accElement.innerText = `= ${
                        result.toString().length > 10 ? result.toExponential(5) : result
                    }`;

                    firstOperandElement.innerText = '';
                    lastOperandElement.innerText = '';
                    operationElement.innerText = '';

                    operands.first = null;
                    operands.last = null;

                    currentOperation = null;
                }
                break;

            // Operations
            case 'operation':
                if (
                    currentOperation === null && 
                    firstOperandElement.innerText.length > 0
                ) {
                    operands.first = parseFloat(firstOperandElement.innerText);
                    operationElement.innerText = this.innerText;
                    currentOperation = operationsEnum[
                        this.dataset.operation.toUpperCase()
                    ];
                }
                else if (
                    currentOperation === null && 
                    firstOperandElement.innerText === '' && 
                    accElement.innerText.length > 0
                ) {
                    let lastResult = accElement.innerText.split(' ')[1] || '';
                    
                    if (lastResult.length > 8) {
                        lastResult = (+lastResult).toExponential(3);
                    }
                        
                    firstOperandElement.innerText = lastResult;
                    operands.first = parseFloat(lastResult);
                    operationElement.innerText = this.innerText;
                    currentOperation = operationsEnum[
                        this.dataset.operation.toUpperCase()
                    ];
                    prevElement.innerText = '';
                }
                break;

            // Changing sign of active operand
            case 'swap':
                if (
                    firstOperandElement.innerText.length > 0 && 
                    currentOperation === null
                ) {
                    firstOperandElement.innerText *= -1;
                }
                else if (
                    lastOperandElement.innerText.length > 0 && 
                    currentOperation !== null
                ) {
                    lastOperandElement.innerText *= -1;
                }
                break;
            
            // Cleaning screen and buffer
            case 'clear':
                clear();
                break;

            // Calculating percent of active operand or result
            case 'percent':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText = percent(firstOperandElement.innerText);
                }
                if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText = percent(lastOperandElement.innerText);
                }
                if (accElement.innerText.length > 0 && currentOperation === null) {
                    let percentResult = percent(+(accElement.innerText.split(' ')[1] || ''));
                    clear();
                    accElement.innerText = `= ${
                        percentResult.toString().length > 10 ? 
                        percentResult.toExponential(5) :
                        percentResult
                    }`;
                }
                break;

            // Deleting characters
            case 'del':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText = firstOperandElement.innerText.slice(0, -1);
                }
                else if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText = lastOperandElement.innerText.slice(0, -1);
                }
                break;

            // Adding point to active operand
            case 'point':
                if (firstOperandElement.innerText.length > 0 && !firstOperandElement.innerText.includes('.') && currentOperation === null) {
                    firstOperandElement.innerText += '.';
                }
                else if (lastOperandElement.innerText.length && !lastOperandElement.innerText.includes('.') > 0 && currentOperation !== null) {
                    lastOperandElement.innerText += '.';
                }
                break;
            
        }
    });
});

// a + b operation
function sum(first, last) {
    return first + last;
}

// a - b operation
function sub(first, last) {
    return first - last;
}

// a * b operation
function mul(first, last) {
    return first * last;
}

// a / b operation
function div(first, last) {
    return first / last;
}

// %a operation
function percent(number) {
    let result = Math.round(number * 0.01 * Math.pow(10, 9)) / Math.pow(10, 9);
    if (result.toString().length > 8) {
        result = result.toExponential(4);
    }
    return result;
}

// Clear function
function clear() {
    operands.first = null;
    operands.last = null;
    firstOperandElement.innerText = '';
    operationElement.innerText = '';
    lastOperandElement.innerText = '';
    accElement.innerText = '';
    prevElement.innerText = '';
    currentOperation = null;
}