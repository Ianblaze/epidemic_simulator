import fs from 'fs';

const model = JSON.parse(fs.readFileSync('src/data/ai_model.json', 'utf8'));

function predict(r0, incubation, infectious, cfr) {
    // 1. Scale input
    const input = [r0, incubation, infectious, cfr];
    const scaledInput = input.map((val, i) => (val - model.scaler_X_mean[i]) / model.scaler_X_scale[i]);
    
    // 2. Forward pass (Layer 1 - ReLU)
    let layer1 = [];
    for (let j = 0; j < model.weights[0][0].length; j++) {
        let sum = model.biases[0][j];
        for (let i = 0; i < scaledInput.length; i++) {
            sum += scaledInput[i] * model.weights[0][i][j];
        }
        // ReLU activation
        layer1.push(Math.max(0, sum));
    }
    
    // 3. Forward pass (Output Layer - Linear)
    let output = [];
    for (let j = 0; j < model.weights[1][0].length; j++) {
        let sum = model.biases[1][j];
        for (let i = 0; i < layer1.length; i++) {
            sum += layer1[i] * model.weights[1][i][j];
        }
        output.push(sum);
    }
    
    // 4. Inverse scale output
    const predictions = output.map((val, i) => (val * model.scaler_y_scale[i]) + model.scaler_y_mean[i]);
    
    return {
        peakDay: Math.max(0, Math.round(predictions[0])),
        peakInfections: Math.max(0, Math.round(predictions[1])),
        totalDeaths: Math.max(0, Math.round(predictions[2]))
    };
}

console.log(predict(2.5, 5.2, 10.0, 0.023));
console.log(predict(4.5, 2.0, 5.0, 0.05));
