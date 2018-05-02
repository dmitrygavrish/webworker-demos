function doCalculations() {
  const iterations = 100000000;
  const power = 2;

  let randomInt;

  const now = performance.now();

  console.log('start calculations');

  for (let i = 0; i < iterations; i++) {
    randomInt = Math.floor(Math.random() * iterations) ** power;
  }

  console.log('end calculations, time taken:', performance.now() - now);

  return randomInt;
}