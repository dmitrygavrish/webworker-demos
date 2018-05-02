const config = {
  animateWith: 'js',
  letWebWorkerCalculate: false
};

const po = new PageObject();
const webWorker = new Worker('web-worker.js');

webWorker.addEventListener('message', e => {
  console.log(`worker said: "${e.data.msg}", and gave us the result:`, e.data.result);
});

po.button.addEventListener('click', () => {
  if (config.letWebWorkerCalculate) {
    webWorker.postMessage('hey there, worker, doCalculations for us!');
  } else {
    const result = doCalculations();

    console.log('we calculated on our own and have the result:', result);
  }
});

po.animate(config.animateWith);