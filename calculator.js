const opsElement = document.querySelector('.screen > .operations');
const accElement = document.querySelector('.screen > .accumulator');
const keys = document.querySelectorAll('.keypad button');

let currentOperation = null;

const operationsEnum = {
    PLUS: 0,
    MINUS: 1,
    MULTIPLY: 2,
    DIVIDE: 3
};

const firstOperandElement = opsElement.querySelector('.first');
const operationElement = opsElement.querySelector('.operation');
const lastOperandElement = opsElement.querySelector('.last');

const operands = {
    first: null,
    last: null
};

keys.forEach(e => {
    e.addEventListener('click', function(e) {
        switch (this.dataset.action) {
            case 'num':
                if (currentOperation === null) {
                    firstOperandElement.innerText += this.dataset.number;
                }
                else {
                    lastOperandElement.innerText += this.dataset.number;
                }
                break;
            case 'equals':
                if (lastOperandElement.innerText.length > 0) {
                    operands.last = parseFloat(lastOperandElement.innerText);

                    let result;

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

                    accElement.innerText = `= ${result}`;
                    firstOperandElement.innerText = '';
                    lastOperandElement.innerText = '';
                    operationElement.innerText = '';

                    operands.first = null;
                    operands.last = null;

                    currentOperation = null;
                }
                break;
            case 'operation':
                if (currentOperation === null && firstOperandElement.innerText.length > 0) {
                    operands.first = parseFloat(firstOperandElement.innerText);
                    operationElement.innerText = this.innerText;
                    currentOperation = operationsEnum[this.dataset.operation.toUpperCase()];
                }
                break;
            case 'swap':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText *= -1;
                }
                else if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText *= -1;
                }
                break;
            case 'clear':
                operands.first = null;
                operands.last = null;
                firstOperandElement.innerText = '';
                operationElement.innerText = '';
                lastOperandElement.innerText = '';
                accElement.innerText = '';
                currentOperation = null;
                break;
            case 'percent':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText /= 100;
                }
                if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText /= 100;
                }
                break;
            case 'del':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText = firstOperandElement.innerText.slice(0, -1);
                }
                else if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText = lastOperandElement.innerText.slice(0, -1);
                }
                break;
            case 'period':
                if (firstOperandElement.innerText.length > 0 && currentOperation === null) {
                    firstOperandElement.innerText += '.';
                }
                else if (lastOperandElement.innerText.length > 0 && currentOperation !== null) {
                    lastOperandElement.innerText += '.';
                }
                break;
            
        }
    });
});

function sum(first, last) {
    return first + last;
}

function sub(first, last) {
    return first - last;
}

function mul(first, last) {
    return first * last;
}

function div(first, last) {
    return first / last;
}