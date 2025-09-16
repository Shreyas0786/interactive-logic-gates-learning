class LogicGatesApp {
    constructor() {
    this.currentGate = 'AND';
    this.inputA = 0;
    this.inputB = 0;
    // Add these new properties to track event handlers
    this.circuitSubmitHandler = null;
    this.circuitNextHandler = null;
    this.practiceSubmitHandler = null;
    this.practiceNextHandler = null;
    this.init();
}

    init() {
        this.setupEventListeners();
        this.loadGate('AND');
        this.updateDisplay();
    }

    setupEventListeners() {
        // Gate selector buttons
        document.querySelectorAll('.gate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectGate(e.target.dataset.gate);
            });
        });

        // Input toggles - use arrow functions to preserve 'this' context
        document.getElementById('inputA').addEventListener('click', () => {
            this.toggleInput('A');
        });

        document.getElementById('inputB').addEventListener('click', () => {
            this.toggleInput('B');
        });
    }

    toggleInput(input) {
    if (input === 'A') {
        this.inputA = this.inputA === 0 ? 1 : 0;
    } else {
        this.inputB = this.inputB === 0 ? 1 : 0;
    }
    this.updateDisplay();
}

    selectGate(gate) {
   if (gate === 'PRACTICE') {
        this.showPracticeSection();
        return;
    }
    
    if (gate === 'CIRCUIT') {
        this.showCircuitSection();
        return;
    }
    // Reset inputs to default state
    this.inputA = 0;
    this.inputB = 0;
    
// Show main sections (in case coming back from practice)
document.querySelector('.gate-display').style.display = 'block';
document.querySelector('.interactive-section').style.display = 'flex';
document.getElementById('truthTable').parentElement.querySelector('h3').style.display = 'block';
document.getElementById('truthTable').style.display = 'table';
document.getElementById('circuit-section').style.display = 'none';
document.getElementById('exercise-section').style.display = 'none'; 
    
    // Update active button
    document.querySelectorAll('.gate-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-gate="${gate}"]`).classList.add('active');

    this.currentGate = gate;
    this.loadGate(gate);
    this.updateDisplay();
}

    loadGate(gate) {
        const gateData = this.getGateData(gate);
        
        document.getElementById('gate-title').textContent = `${gate} Gate`;
        document.getElementById('gate-symbol').innerHTML = gateData.symbol;
        document.getElementById('gate-description').textContent = gateData.description;
        
        // Show/hide second input for NOT gate
        const inputB = document.getElementById('inputB').parentElement;
        if (gate === 'NOT') {
            inputB.style.display = 'none';
        } else {
            inputB.style.display = 'flex';
        }
        
        this.generateTruthTable(gate);
    }

    getGateData(gate) {
        const gates = {
            AND: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="40" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="105" y1="40" x2="140" y2="40" stroke="black" stroke-width="2"/>
                        <!-- AND gate shape (D-shaped: flat left, curved right) -->
                        <path d="M 40 15 L 80 15 A 25 25 0 0 1 80 65 L 40 65 Z" 
                              fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="135" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The AND gate outputs 1 only when both inputs are 1. Otherwise, it outputs 0."
            },
            
            OR: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="39" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="39" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="80" y1="40" x2="120" y2="40" stroke="black" stroke-width="2"/>
                        <!-- OR gate shape (curved input, pointed output) -->
                        <path d="M 35 20 Q 50 20 65 30 L 80 40 L 65 50 Q 50 60 35 60 Q 55 40 35 20 Z" 
                            fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="120" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The OR gate outputs 1 when at least one input is 1. It outputs 0 only when both inputs are 0."
            },
            
            NOT: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input line -->
                        <line x1="10" y1="40" x2="40" y2="40" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="95" y1="40" x2="140" y2="40" stroke="black" stroke-width="2"/>
                        <!-- NOT gate triangle -->
                        <polygon points="40,20 40,60 85,40" fill="none" stroke="black" stroke-width="2"/>
                        <!-- Inverter bubble (small circle) -->
                        <circle cx="90" cy="40" r="5" fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input label -->
                        <text x="5" y="35" font-family="Arial" font-size="12" fill="black">A</text>
                        <!-- Output label -->
                        <text x="130" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The NOT gate (inverter) outputs the opposite of its input. If input is 1, output is 0, and vice versa."
            },
            
            NAND: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="40" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="115" y1="40" x2="140" y2="40" stroke="black" stroke-width="2"/>
                        <!-- AND gate shape -->
                        <path d="M 40 15 L 80 15 A 25 25 0 0 1 80 65 L 40 65 Z" 
                              fill="none" stroke="black" stroke-width="2"/>
                        <!-- NAND inverter bubble -->
                        <circle cx="110" cy="40" r="5" fill="none" stroke="black" stroke-width="2"/>
                        <!-- Connection from AND to bubble -->
                        <line x1="105" y1="40" x2="105" y2="40" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="130" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The NAND gate is the opposite of AND. It outputs 0 only when both inputs are 1. Otherwise, it outputs 1."
            },
            
            NOR: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="40" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="90" y1="40" x2="120" y2="40" stroke="black" stroke-width="2"/>
                        <!-- OR gate shape -->
                        <path d="M 35 20 Q 50 20 65 30 L 80 40 L 65 50 Q 50 60 35 60 Q 55 40 35 20 Z" 
                            fill="none" stroke="black" stroke-width="2"/>
                        <!-- NOR inverter bubble -->
                        <circle cx="85" cy="40" r="5" fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="120" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The NOR gate is the opposite of OR. It outputs 1 only when both inputs are 0. Otherwise, it outputs 0."
            },
            
            XOR: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="40" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="80" y1="40" x2="120" y2="40" stroke="black" stroke-width="2"/>
                        <!-- Extra curved line at input (XOR distinguishing feature) -->
                        <path d="M 25 15 Q 35 40 25 65" fill="none" stroke="black" stroke-width="2"/>
                        <!-- OR gate shape -->
                        <path d="M 35 20 Q 50 20 65 30 L 80 40 L 65 50 Q 50 60 35 60 Q 55 40 35 20 Z" 
                            fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="120" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The XOR gate outputs 1 when inputs are different (one is 1, the other is 0). It outputs 0 when both inputs are the same."
            },

            XNOR: {
                symbol: `
                    <svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg">
                        <!-- Input lines -->
                        <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
                        <line x1="10" y1="55" x2="40" y2="55" stroke="black" stroke-width="2"/>
                        <!-- Output line -->
                        <line x1="90" y1="40" x2="120" y2="40" stroke="black" stroke-width="2"/>
                        <!-- Extra curved line at input (XOR distinguishing feature) -->
                        <path d="M 25 15 Q 35 40 25 65" fill="none" stroke="black" stroke-width="2"/>
                        <!-- OR gate shape -->
                        <path d="M 35 20 Q 50 20 65 30 L 80 40 L 65 50 Q 50 60 35 60 Q 55 40 35 20 Z" 
                            fill="none" stroke="black" stroke-width="2"/>
                        <!-- XNOR inverter bubble (small circle) -->
                        <circle cx="85" cy="40" r="5" fill="none" stroke="black" stroke-width="2"/>
                        <!-- Input labels -->
                        <text x="5" y="20" font-family="Arial" font-size="12" fill="black">A</text>
                        <text x="5" y="68" font-family="Arial" font-size="12" fill="black">B</text>
                        <!-- Output label -->
                        <text x="120" y="35" font-family="Arial" font-size="12" fill="black">Q</text>
                    </svg>
                `,
                description: "The XNOR gate outputs 1 when inputs are the same (both 0 or both 1). It outputs 0 when inputs are different."
            },
        };

        return gates[gate];
    }

    calculateOutput() {
        switch (this.currentGate) {
            case 'AND':
                return this.inputA && this.inputB ? 1 : 0;
            case 'OR':
                return this.inputA || this.inputB ? 1 : 0;
            case 'NOT':
                return this.inputA ? 0 : 1;
            case 'NAND':
                return this.inputA && this.inputB ? 0 : 1;
            case 'NOR':
                return this.inputA || this.inputB ? 0 : 1;
            case 'XOR':
                return this.inputA !== this.inputB ? 1 : 0;
            case 'XNOR':
                return this.inputA === this.inputB ? 1 : 0;
            default:
                return 0;
        }
    }

    updateDisplay() {
        // Update input buttons
        const inputABtn = document.getElementById('inputA');
        const inputBBtn = document.getElementById('inputB');
        
        inputABtn.textContent = this.inputA;
        inputABtn.dataset.value = this.inputA;
        inputBBtn.textContent = this.inputB;
        inputBBtn.dataset.value = this.inputB;

        // Update output LED
        const output = this.calculateOutput();
        const outputLED = document.getElementById('outputLED');
        outputLED.textContent = output;
        outputLED.className = output ? 'output-led on' : 'output-led off';

        // Highlight current row in truth table
        this.highlightTruthTableRow();
    }
    

    generateTruthTable(gate) {
        const table = document.getElementById('truthTable');
        let html = '';

        if (gate === 'NOT') {
            html = `
                <tr>
                    <th>A</th>
                    <th>Output</th>
                </tr>
                <tr data-inputs="0">
                    <td>0</td>
                    <td>${this.calculateGateOutput(gate, 0, 0)}</td>
                </tr>
                <tr data-inputs="1">
                    <td>1</td>
                    <td>${this.calculateGateOutput(gate, 1, 0)}</td>
                </tr>
            `;
        } else {
            html = `
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>Output</th>
                </tr>
                <tr data-inputs="0,0">
                    <td>0</td>
                    <td>0</td>
                    <td>${this.calculateGateOutput(gate, 0, 0)}</td>
                </tr>
                <tr data-inputs="0,1">
                    <td>0</td>
                    <td>1</td>
                    <td>${this.calculateGateOutput(gate, 0, 1)}</td>
                </tr>
                <tr data-inputs="1,0">
                    <td>1</td>
                    <td>0</td>
                    <td>${this.calculateGateOutput(gate, 1, 0)}</td>
                </tr>
                <tr data-inputs="1,1">
                    <td>1</td>
                    <td>1</td>
                    <td>${this.calculateGateOutput(gate, 1, 1)}</td>
                </tr>
            `;
        }

        table.innerHTML = html;
    }

    calculateGateOutput(gate, a, b) {
        switch (gate) {
            case 'AND':
                return a && b ? 1 : 0;
            case 'OR':
                return a || b ? 1 : 0;
            case 'NOT':
                return a ? 0 : 1;
            case 'NAND':
                return a && b ? 0 : 1;
            case 'NOR':
                return a || b ? 0 : 1;
            case 'XOR':
                return a !== b ? 1 : 0;
            case 'XNOR':
                return a === b ? 1 : 0;
            default:
                return 0;
        }
    }

    showCircuitSection() {
    // Update active button
    document.querySelectorAll('.gate-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-gate="CIRCUIT"]').classList.add('active');
    
    // Hide main sections
    document.querySelector('.gate-display').style.display = 'none';
    document.querySelector('.interactive-section').style.display = 'none';
    document.getElementById('truthTable').parentElement.querySelector('h3').style.display = 'none';
    document.getElementById('truthTable').style.display = 'none';
    document.getElementById('exercise-section').style.display = 'none';
    document.getElementById('circuit-section').style.display = 'block';
    
    // Show circuit section
    document.getElementById('circuit-section').style.display = 'block';
    
    // Initialize circuit practice
    this.circuitPractice = new LogicDiagramPractice();
    this.circuitPractice.showQuestion();
    
    // Remove old listeners and set up new ones
const circuitSubmitBtn = document.getElementById('circuit-submit');
const circuitNextBtn = document.getElementById('circuit-next');
if (circuitSubmitBtn) {
    circuitSubmitBtn.replaceWith(circuitSubmitBtn.cloneNode(true));
    document.getElementById('circuit-submit').addEventListener('click', () => {
        this.circuitPractice.submitAnswer();
    });
}
if (circuitNextBtn) {
    circuitNextBtn.replaceWith(circuitNextBtn.cloneNode(true));
    document.getElementById('circuit-next').addEventListener('click', () => {
        this.circuitPractice.nextQuestion();
    });
}
}

    showPracticeSection() {
    // Update active button to Practice
    document.querySelectorAll('.gate-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-gate="PRACTICE"]').classList.add('active');
    
    // Hide main sections
    document.querySelector('.gate-display').style.display = 'none';
    document.querySelector('.interactive-section').style.display = 'none';
    document.getElementById('truthTable').parentElement.querySelector('h3').style.display = 'none';
    document.getElementById('truthTable').style.display = 'none';
    document.getElementById('circuit-section').style.display = 'none';
    
    // Show practice section
    document.getElementById('exercise-section').style.display = 'block';
    
    // Initialize practice
    this.practiceExercise = new PracticeExercise();
    this.practiceExercise.showQuestion();
    
    // Set up event listeners
    document.getElementById('submit-answer').addEventListener('click', () => {
        this.practiceExercise.submitAnswer();
    });
    
    document.getElementById('next-question').addEventListener('click', () => {
        this.practiceExercise.nextQuestion();
    });
}

    highlightTruthTableRow() {
        // Remove previous highlights
        document.querySelectorAll('#truthTable tr').forEach(row => {
            row.classList.remove('highlight');
        });

        // Highlight current row
        let currentInputs;
        if (this.currentGate === 'NOT') {
            currentInputs = `${this.inputA}`;
        } else {
            currentInputs = `${this.inputA},${this.inputB}`;
        }

        const currentRow = document.querySelector(`tr[data-inputs="${currentInputs}"]`);
        if (currentRow) {
            currentRow.classList.add('highlight');
        }
    }
}

class LogicDiagramPractice {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.currentAnswer = '';
        this.questions = [];
        this.generateAllQuestions();
    }

        generateAllQuestions() {
        // Simple 2-gate circuits with manually calculated answers
        const circuits = [
            { gates: ['AND', 'NOT'], inputs: {A: 0, B: 1}, correctAnswer: 1, description: 'AND then NOT' },
            { gates: ['OR', 'NOT'], inputs: {A: 1, B: 0}, correctAnswer: 0, description: 'OR then NOT' },
            { gates: ['NAND', 'NOT'], inputs: {A: 0, B: 0}, correctAnswer: 0, description: 'NAND then NOT' },
            { gates: ['XOR', 'NOT'], inputs: {A: 1, B: 1}, correctAnswer: 1, description: 'XOR then NOT' },
            { gates: ['AND', 'NOT'], inputs: {A: 1, B: 1}, correctAnswer: 0, description: 'AND then NOT' },
            { gates: ['OR', 'NOT'], inputs: {A: 0, B: 0}, correctAnswer: 1, description: 'OR then NOT' },
            { gates: ['NAND', 'NOT'], inputs: {A: 1, B: 1}, correctAnswer: 1, description: 'NAND then NOT' },
            { gates: ['XOR', 'NOT'], inputs: {A: 0, B: 1}, correctAnswer: 0, description: 'XOR then NOT' },
            { gates: ['AND', 'NOT'], inputs: {A: 0, B: 0}, correctAnswer: 1, description: 'AND then NOT' },
            { gates: ['OR', 'NOT'], inputs: {A: 1, B: 1}, correctAnswer: 0, description: 'OR then NOT' }
        ];
        
        this.questions = [];
        for (let i = 0; i < this.totalQuestions; i++) {
            const circuit = circuits[i % circuits.length];
            this.questions.push({
                circuit: { gates: circuit.gates, description: circuit.description },
                inputs: circuit.inputs,
                correctAnswer: circuit.correctAnswer,
                choices: [0, 1].sort(() => Math.random() - 0.5)
            });
        }
    }

    generateRandomInputs(circuit) {
        const inputs = {};
        const inputLabels = ['A', 'B', 'C', 'D'];
        const numInputs = this.getRequiredInputs(circuit);
        
        for (let i = 0; i < numInputs; i++) {
            inputs[inputLabels[i]] = Math.random() < 0.5 ? 0 : 1;
        }
        return inputs;
    }

    getRequiredInputs(circuit) {
        // Determine how many unique inputs the circuit needs
        const hasThreeInput = circuit.gates.length > 2;
        return hasThreeInput ? 3 : 2;
    }

    calculateCircuitOutput(circuit, inputs) {
        const gateOutputs = [];
        
        // Calculate each gate's output
        for (let i = 0; i < circuit.gates.length; i++) {
            const gate = circuit.gates[i];
            let output;
            
            if (i === 0) {
                // First gate uses primary inputs
                if (gate === 'NOT') {
                    output = this.calculateGateOutput(gate, inputs.A, 0);
                } else {
                    output = this.calculateGateOutput(gate, inputs.A, inputs.B);
                }
            } else if (i === 1 && circuit.gates.length === 2) {
                // Second gate in 2-gate circuit uses first gate's output
                output = this.calculateGateOutput(gate, gateOutputs[0], 0);
            } else {
                // More complex connections - simplified for now
                if (gate === 'NOT') {
                    output = this.calculateGateOutput(gate, gateOutputs[i-1], 0);
                } else {
                    const input1 = i === 1 ? inputs.C || inputs.B : gateOutputs[0];
                    const input2 = i === 1 ? inputs.B || inputs.A : gateOutputs[1] || inputs.C;
                    output = this.calculateGateOutput(gate, input1, input2);
                }
            }
            
            gateOutputs.push(output);
        }
        
        return gateOutputs[gateOutputs.length - 1]; // Return final output
    }

    calculateGateOutput(gate, a, b) {
        switch (gate) {
            case 'AND': return a && b ? 1 : 0;
            case 'OR': return a || b ? 1 : 0;
            case 'NOT': return a ? 0 : 1;
            case 'NAND': return a && b ? 0 : 1;
            case 'NOR': return a || b ? 0 : 1;
            case 'XOR': return a !== b ? 1 : 0;
            default: return 0;
        }
    }

generateCircuitSVG(circuit, inputs) {
    let svg = '<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #ccc; background: white;">';
    
    // Add input labels and lines
    const inputKeys = Object.keys(inputs);
    svg += '<g>';
    inputKeys.forEach((input, i) => {
        const y = 40 + i * 40;
        svg += `<text x="20" y="${y}" font-family="Arial" font-size="16" fill="black" font-weight="bold">${input} = ${inputs[input]}</text>`;
        svg += `<line x1="80" y1="${y-5}" x2="150" y2="${y-5}" stroke="black" stroke-width="3"/>`;
    });
    
    // Add gates as colored rectangles with clear labels
    circuit.gates.forEach((gate, i) => {
        const x = 200 + i * 120;
        const y = 70;
        
        // Gate rectangle
        svg += `<rect x="${x}" y="${y}" width="80" height="40" fill="#e3f2fd" stroke="#1976d2" stroke-width="2" rx="5"/>`;
        svg += `<text x="${x+40}" y="${y+25}" font-family="Arial" font-size="14" text-anchor="middle" fill="#1976d2" font-weight="bold">${gate}</text>`;
        
        // Connection lines between gates
        if (i < circuit.gates.length - 1) {
            svg += `<line x1="${x+80}" y1="${y+20}" x2="${x+120}" y2="${y+20}" stroke="black" stroke-width="3"/>`;
        }
    });
    
    // Add output line and label
    const lastX = 200 + (circuit.gates.length - 1) * 120;
    svg += `<line x1="${lastX+80}" y1="90" x2="${lastX+130}" y2="90" stroke="black" stroke-width="3"/>`;
    svg += `<circle cx="${lastX+140}" cy="90" r="8" fill="#4caf50" stroke="black" stroke-width="2"/>`;
    svg += `<text x="${lastX+150}" y="85" font-family="Arial" font-size="16" fill="black" font-weight="bold">Q</text>`;
    
    svg += '</g></svg>';
    return svg;
}

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        
        document.getElementById('circuit-counter').textContent = `Question ${this.currentQuestion} of ${this.totalQuestions}`;
        
        // Format input display
        const inputDisplay = Object.entries(question.inputs)
            .map(([key, value]) => `${key}=${value}`)
            .join(', ');
        
        document.getElementById('circuit-question').textContent = `If ${inputDisplay}, what is output Q?`;
        
        // Generate circuit diagram
        document.getElementById('circuit-diagram').innerHTML = this.generateCircuitSVG(question.circuit, question.inputs);
        
        // Generate answer choices
        const choicesHTML = question.choices.map((choice, index) => 
            `<button class="circuit-choice" data-answer="${choice}">${choice}</button>`
        ).join('');
        
        document.getElementById('circuit-choices').innerHTML = choicesHTML;
        document.getElementById('circuit-submit').style.display = 'none';
        document.getElementById('circuit-next').style.display = 'none';
        document.getElementById('circuit-feedback').innerHTML = '';
        
        // Add click handlers
        document.querySelectorAll('.circuit-choice').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e.target));
        });
    }

    selectAnswer(selectedBtn) {
        document.querySelectorAll('.circuit-choice').forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
        this.currentAnswer = selectedBtn.dataset.answer;
        document.getElementById('circuit-submit').style.display = 'inline-block';
    }

    submitAnswer() {
        const question = this.questions[this.currentQuestion - 1];
        const isCorrect = parseInt(this.currentAnswer) === question.correctAnswer;
        const explanation = `The circuit ${question.circuit.description} produces output ${question.correctAnswer}.`;
        
        if (isCorrect) {
            document.getElementById('circuit-feedback').innerHTML = `
                <span class="correct">✓ Correct!</span>
                <p class="explanation">${explanation}</p>
            `;
        } else {
            document.getElementById('circuit-feedback').innerHTML = `
                <span class="incorrect">✗ Incorrect. The correct answer is ${question.correctAnswer}</span>
                <p class="explanation">${explanation}</p>
            `;
        }
        
        document.getElementById('circuit-submit').style.display = 'none';
        
        if (this.currentQuestion < this.totalQuestions) {
            document.getElementById('circuit-next').style.display = 'inline-block';
        } else {
            document.getElementById('circuit-next').textContent = 'Finish Quiz';
            document.getElementById('circuit-next').style.display = 'inline-block';
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        document.getElementById('circuit-feedback').innerHTML = `
            <div class="final-score">
                <h3>Circuit Practice Complete!</h3>
                <p>You've completed all ${this.totalQuestions} circuit questions!</p>
                <button onclick="location.reload()" class="restart-btn">Try Again</button>
            </div>
        `;
        document.getElementById('circuit-next').style.display = 'none';
    }
}

class PracticeExercise {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.currentAnswer = '';
        this.questions = [];
        this.generateAllQuestions();
    }

    generateAllQuestions() {
    const gates = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
    this.questions = [];
    const usedGates = [];
    
    for (let i = 0; i < this.totalQuestions; i++) {
        let correctGate;
        if (usedGates.length === gates.length) {
            // If we've used all gates, start over but shuffle
            usedGates.length = 0;
        }
        
        do {
            correctGate = gates[Math.floor(Math.random() * gates.length)];
        } while (usedGates.includes(correctGate));
        
        usedGates.push(correctGate);
        
        const wrongOptions = gates.filter(g => g !== correctGate);
        const selectedWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [correctGate, ...selectedWrong].sort(() => Math.random() - 0.5);
        
        this.questions.push({
            gate: correctGate,
            options: options,
            truthTable: this.generateTruthTable(correctGate)
        });
    }
}

    generateTruthTable(gate) {
        if (gate === 'NOT') {
            return [
                { inputs: [0], output: this.calculateOutput(gate, 0, 0) },
                { inputs: [1], output: this.calculateOutput(gate, 1, 0) }
            ];
        } else {
            return [
                { inputs: [0, 0], output: this.calculateOutput(gate, 0, 0) },
                { inputs: [0, 1], output: this.calculateOutput(gate, 0, 1) },
                { inputs: [1, 0], output: this.calculateOutput(gate, 1, 0) },
                { inputs: [1, 1], output: this.calculateOutput(gate, 1, 1) }
            ];
        }
    }

    calculateOutput(gate, a, b) {
        switch (gate) {
            case 'AND': return a && b ? 1 : 0;
            case 'OR': return a || b ? 1 : 0;
            case 'NOT': return a ? 0 : 1;
            case 'NAND': return a && b ? 0 : 1;
            case 'NOR': return a || b ? 0 : 1;
            case 'XOR': return a !== b ? 1 : 0;
            case 'XNOR': return a === b ? 1 : 0;
            default: return 0;
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        
        document.getElementById('question-counter').textContent = `Question ${this.currentQuestion} of ${this.totalQuestions}`;
        document.getElementById('question-text').textContent = 'Which gate does this truth table represent?';
        
        // Generate truth table HTML
        let tableHTML = '';
        if (question.gate === 'NOT') {
            tableHTML = `
                <tr><th>A</th><th>OUTPUT</th></tr>
                ${question.truthTable.map(row => 
                    `<tr><td>${row.inputs[0]}</td><td>${row.output}</td></tr>`
                ).join('')}
            `;
        } else {
            tableHTML = `
                <tr><th>A</th><th>B</th><th>OUTPUT</th></tr>
                ${question.truthTable.map(row => 
                    `<tr><td>${row.inputs[0]}</td><td>${row.inputs[1]}</td><td>${row.output}</td></tr>`
                ).join('')}
            `;
        }
        
        document.getElementById('exercise-truth-table').innerHTML = tableHTML;
        
        // Generate answer choices
        const choicesHTML = question.options.map((option, index) => 
            `<button class="answer-choice" data-answer="${option}">${String.fromCharCode(97 + index)}. ${option}</button>`
        ).join('');
        
        document.getElementById('answer-choices').innerHTML = choicesHTML;
        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('feedback').innerHTML = '';
        
        // Add click handlers to choices
        document.querySelectorAll('.answer-choice').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e.target));
        });
    }

    selectAnswer(selectedBtn) {
        document.querySelectorAll('.answer-choice').forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
        this.currentAnswer = selectedBtn.dataset.answer;
        document.getElementById('submit-answer').style.display = 'inline-block';
    }

    submitAnswer() {
    const question = this.questions[this.currentQuestion - 1];
    const isCorrect = this.currentAnswer === question.gate;
    const explanation = this.getExplanation(question.gate);
    
    if (isCorrect) {
            document.getElementById('feedback').innerHTML = `
                <span class="correct">✓ Correct!</span>
                <p class="explanation">${explanation}</p>
            `;
        } else {
            document.getElementById('feedback').innerHTML = `
                <span class="incorrect">✗ Incorrect. The correct answer is ${question.gate}</span>
                <p class="explanation">${explanation}</p>
            `;
        }
    
    document.getElementById('submit-answer').style.display = 'none';
    
    if (this.currentQuestion < this.totalQuestions) {
        document.getElementById('next-question').style.display = 'inline-block';
    } else {
        document.getElementById('next-question').textContent = 'Finish Quiz';
        document.getElementById('next-question').style.display = 'inline-block';
    }
}

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    getExplanation(gate) {
    const explanations = {
        'AND': 'AND gate outputs 1 only when ALL inputs are 1.',
        'OR': 'OR gate outputs 1 when AT LEAST ONE input is 1.',
        'NOT': 'NOT gate inverts the input - 0 becomes 1, 1 becomes 0.',
        'NAND': 'NAND gate is opposite of AND - outputs 0 only when both inputs are 1.',
        'NOR': 'NOR gate is opposite of OR - outputs 1 only when both inputs are 0.',
        'XOR': 'XOR gate outputs 1 when inputs are DIFFERENT (not the same).',
        'XNOR': 'XNOR gate outputs 1 when inputs are the SAME (both 0 or both 1).'
    };
    return explanations[gate];
}

    finishQuiz() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        document.getElementById('feedback').innerHTML = `
            <div class="final-score">
                <h3>Quiz Complete!</h3>
                <p>You've completed all ${this.totalQuestions} practice questions!</p>
                <button onclick="location.reload()" class="restart-btn">Try Again</button>
            </div>
        `;
        document.getElementById('next-question').style.display = 'none';
    }
}
// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LogicGatesApp();
});
