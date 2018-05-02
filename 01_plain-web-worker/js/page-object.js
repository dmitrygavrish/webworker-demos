class PageObject {
  constructor() {
    this.button = document.getElementById('start-calculations');
    this.slidingBlock = document.getElementById('sliding-block');
  }

  animate(animateWith) {
    if (animateWith === 'js') {
      animate(timePassed => {
        const animationTime = 1000;
        const iterationTimePassed = timePassed % animationTime;
        const direction = Math.floor((timePassed / animationTime)) % 2;
        const distanceInPx = 240;
        const minDistance = 0;

        if (direction) {
          const distance = (distanceInPx / animationTime) * iterationTimePassed;
          this.slidingBlock.style.left = (distance > distanceInPx ? distanceInPx : distance) + 'px';
        } else {
          const distance = (distanceInPx / animationTime) * (animationTime - iterationTimePassed);
          this.slidingBlock.style.left = (distance < minDistance ? minDistance : distance) + 'px';
        }
      });
    } else if (animateWith === 'css') {
      this.slidingBlock.classList.add('animate');
    }
  }
}
