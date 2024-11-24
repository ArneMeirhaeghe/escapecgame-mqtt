let timerInstance = null;

class Timer {
  #onTick = null;

  constructor() {
    this.elapsedTime = 1800;
    this.timerId = null;
  }

  set onTick(onTick) {
    console.log('tick');
    this.#onTick = onTick;
  }

  start() {
    this.timerId = setInterval(() => {
      this.elapsedTime -= 1;
      if(this.#onTick) this.#onTick(this.elapsedTime);
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
    this.elapsedTime = 1800;
    if(this.#onTick) this.#onTick(1800);
  }

  static getInstance() {
    if (timerInstance === null) {
      timerInstance = new Timer();
    }

    return timerInstance;
  }
}

export default Timer;
