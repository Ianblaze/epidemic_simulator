import fs from 'fs';

const model = JSON.parse(fs.readFileSync('src/data/optimizer_model.json', 'utf8'));

function predict(r0, incubation, infectious, cfr) {
    const input = [r0, incubation, infectious, cfr];
    let currentActivation = input.map((val, i) => (val - model.scaler_X_mean[i]) / model.scaler_X_scale[i]);
    
    // Loop through all hidden layers + output layer
    for (let layer = 0; layer < model.weights.length; layer++) {
        const nextActivation = [];
        for (let j = 0; j < model.weights[layer][0].length; j++) {
            let sum = model.biases[layer][j];
            for (let i = 0; i < currentActivation.length; i++) {
                sum += currentActivation[i] * model.weights[layer][i][j];
            }
            // ReLU for hidden layers, Linear for output layer
            if (layer < model.weights.length - 1) {
                nextActivation.push(Math.max(0, sum));
            } else {
                nextActivation.push(sum);
            }
        }
        currentActivation = nextActivation;
    }
    
    // Inverse scale output
    const predictions = currentActivation.map((val, i) => (val * model.scaler_y_scale[i]) + model.scaler_y_mean[i]);
    
    return predictions[0];
}

console.log('R0=5, CFR=0.02 -> Optimal Stringency:', predict(5, 5.2, 10.0, 0.023));
console.log('R0=2, CFR=0.02 -> Optimal Stringency:', predict(2, 5.2, 10.0, 0.023));
