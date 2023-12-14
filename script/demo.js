let gate = new FLTGate();

let timer = 0;

function gradientDemo() {
    const   now = new Date().getTime(),
            startIn = now + 1000,
            stopIn = startIn + 5000,
            startOut = stopIn + 5000,
            stopOut = startOut + 5000,
            length = 17000;

    gate.setGradient(startIn, stopIn, startOut, stopOut);

    clearInterval(timer);
    timer = setInterval(function() {
        let r = gate.gradientTest();
        console.log(`STATE:\t${r.state}\tRATE:\t${r.rate}`);
    }, 500);

    setTimeout(function() {
        clearInterval(timer);
    }, length);
}