function animate(drawFn) {
  const start = performance.now();

  requestAnimationFrame(function animation(time) {
    const timePassed = time - start;

    drawFn(timePassed);
    requestAnimationFrame(animation);
  });
}