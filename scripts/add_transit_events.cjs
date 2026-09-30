const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

if (!code.includes('const [transitEvents, setTransitEvents] = useState([]);')) {
    code = code.replace(
        '  const [gameResult, setGameResult] = useState(null);',
        '  const [gameResult, setGameResult] = useState(null);\n  const [transitEvents, setTransitEvents] = useState([]);'
    );
    
    code = code.replace(
        'statesRef.current = result.newStates;',
        'statesRef.current = result.newStates;\n    setTransitEvents(result.transitEvents || []);'
    );
    
    code = code.replace(
        '    return {',
        '    return {\n    transitEvents,'
    );
}

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log("Updated useSimulation.js to output transitEvents");
