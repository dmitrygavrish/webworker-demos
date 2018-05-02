self.addEventListener('message', e => {
  importScripts('js/calculations.js');

  const result = doCalculations();

  postMessage({
    msg: 'hey there, main thread, i have something for you',
    result
  });
});
