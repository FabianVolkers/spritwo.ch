class SplitFlap {
  constructor(opts) {
    var self = this;
    self[0] =
      typeof opts.id === "string" ? document.getElementById(opts.id) : opts.id;
    var _elm = self[0];
    var _cardFrontLetter = _elm.querySelector(".card.front .letter");
    var _cardBackLetter = _elm.querySelector(".card.back .letter");
    var _cardTopLetter = _elm.querySelector(".card.top .letter");
    var _cardBottomLetter = _elm.querySelector(".card.bottom .letter");
    var _animationTime = 950; // in ms
    var _animationDelayTime = 0; // in ms; time between to animations waiting
    var _animationStack = []; // stores letter if animation is already started
    var _animationRunning = false; // is true if we do an animation
    var _animationClassName = "do-flap";

    self.to = (letter, animationTime=_animationTime, animationDelayTime=_animationDelayTime) => {

      // console.log("Animation time: " + animationTime + "ms")
      if (_animationRunning === true) {
        _animationStack.push(letter);
      } else if (letter === self.letter()) {
        if (_animationStack.length > 0) {
          self.to(_animationStack.shift());
        }
      } else {
        _animationRunning = true;
        _cardTopLetter.innerText = letter;
        _cardBackLetter.innerText = letter;

        // set transision active to elements
        _cardFrontLetter.parentNode.style.transition =
          "transform " + animationTime + "ms";
        _cardBackLetter.parentNode.style.transition =
          "transform " + animationTime + "ms";

        // do animation
        window.requestAnimationFrame(() => {
          _elm.classList.add(_animationClassName);
          setTimeout(() => {
            // remove transision active to elements
            _cardFrontLetter.parentNode.style.transition = "";
            _cardBackLetter.parentNode.style.transition = "";

            window.requestAnimationFrame(() => {
              _cardFrontLetter.innerText = letter;
              _cardBottomLetter.innerText = letter;

              _elm.classList.remove(_animationClassName);
              window.requestAnimationFrame(() => {
                _animationRunning = false;
                if (_animationStack.length > 0) {
                  self.to(_animationStack.shift());
                }
              });
            });
          }, animationTime + animationDelayTime);
        });
      }
    };

    self.letter = function () {
      return _cardFrontLetter.innerText;
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const NUMBER_OF_FLAPS = 10;
  const startingString = "SPRITWOCH ";
  const wrapElm = document.getElementById("wrap");

  let splitFlaps = [];

  for (let i = 0; i < NUMBER_OF_FLAPS; ++i) {
    newFlap = document.createElement("div");
    newFlap.classList.add("split-flap");
    newFlap.id = "flap-" + i;
    newFlap.innerHTML = `
        <div class="card front">
            <div class="letter">${startingString[i]}</div>
        </div>
        <div class="card back">
            <div class="letter">${startingString[i]}</div>
        </div>
        <div class="card top">
            <div class="letter">${startingString[i]}</div>
        </div>
        <div class="card bottom">
            <div class="letter">${startingString[i]}</div>
        </div>
        `;
    wrapElm.appendChild(newFlap);

    splitFlaps.push(
      new SplitFlap({
        id: "flap-" + i,
      })
    );
  }
  const targetDate = new Date(targetDateString);
  setTimeout(() => {
    let now = new Date();
    const remainingTime = targetDate - now;
    // Count up from 0 until remaingTime is reached
    // let countUp = 0
    // while(countUp < remainingTime) {
    //     console.log(countUp)
    //     const hours = Math.floor(countUp / (1000 * 60 * 60));
    //     const minutes = Math.floor(
    //         (countUp % (1000 * 60 * 60)) / (1000 * 60)
    //     );
    //     const seconds = Math.floor((countUp % (1000 * 60)) / 1000);
    //     const hoursStr = String(hours).padStart(2, "0");
    //     const minutesStr = String(minutes).padStart(2, "0");
    //     const secondsStr = String(seconds).padStart(2, "0");
    //     let dateStr = hoursStr + ":" + minutesStr + ":" + secondsStr;
    //     for (let i = 0; i < dateStr.length; ++i) {
    //         splitFlaps[i+1].to(dateStr[i], 5, 0);
    //     }
    //     countUp += 1000;
    // }
    beginCountdown();
  }, 1000);

  function beginCountdown() {
    console.log("begin countdown");

    setInterval(() => {
      let now = new Date();
      //   let hours = ("0" + now.getHours()).substr(-2);
      //   let minutes = ("0" + now.getMinutes()).substr(-2);
      //   let seconds = ("0" + now.getSeconds()).substr(-2);

      //   let dateStr = hours + ":" + minutes + ":" + seconds;
      splitFlaps[0].to(" ");
      splitFlaps[9].to(" ");
      const remainingTime = targetDate - now;

      if (remainingTime < 0) {
        //   clearInterval(intervalId);
        //   countdown.textContent = "00 : 00 : 00";
        let dateStr = "ABFAHRT!";
        for (let i = 0; i < dateStr.length; ++i) {
          splitFlaps[i + 1].to(dateStr[i]);
        }
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      const hoursStr = String(hours).padStart(2, "0");
      const minutesStr = String(minutes).padStart(2, "0");
      const secondsStr = String(seconds).padStart(2, "0");
      //   let hours = ('0' + now.getHours()).substr(-2);
      //   let minutes = ('0' + now.getMinutes()).substr(-2);
      //   let seconds = ('0' + now.getSeconds()).substr(-2);

      let dateStr = hoursStr + ":" + minutesStr + ":" + secondsStr;
      for (let i = 0; i < dateStr.length; ++i) {
        splitFlaps[i + 1].to(dateStr[i]);
      }
    }, 1000);
  }
});
