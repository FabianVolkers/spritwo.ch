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

    self.to = (
      letter,
      animationTime = _animationTime,
      animationDelayTime = _animationDelayTime
    ) => {
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
                  self.to(_animationStack.shift(), animationTime, animationDelayTime);
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
  console.log("Target date: " + targetDateString);
  console.log("Start string: " + startString);
  console.log("Animate: " + animate);
  console.log("Event Location: " + eventLocation);

  const targetDate = new Date(targetDateString);

  let rows;
  if(numberOfRows === 1) {
    rows = setRows(startString);
  } else {
    // TODO: extract method setPreviewRows
    if(window.location.pathname === "/preview") {
      // targetDate to string with fromat DD MMM YYYY
      const dateStr = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      console.log("Date string: " + dateStr)
      // targetDate to string with fromat HH:MM
      const timeString = targetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      console.log("Time string: " + timeString)
      rows = setRows(dateStr, timeString, eventLocation);
    } else {
      console.log("Multiple rows not yet supported for this page");
    }
  }

  
  
  const NUMBER_OF_FLAPS = numberOfFlaps ?? 10; // TODO: fix undefined numberOfFlaps
  const NUMBER_OF_ROWS = numberOfRows ?? 1; // TODO: fix undefined numberOfRows

  const startingString = startString || "SPRITWOCH "; // TODO: fix undefined startString
  const wrapElm = document.getElementById("outer-wrap");

  let splitFlaps = [];

for (let row = 0; row < Math.min(NUMBER_OF_ROWS, rows.length); row++) {
    //create wrap element
    let newWrap = document.createElement("div");
    newWrap.classList.add("wrap");
    newWrap.id = "wrap-" + row;
    wrapElm.appendChild(newWrap);

    let string = rows[row].string;

    for (let col = 0; col < NUMBER_OF_FLAPS; ++col) {
      newFlap = document.createElement("div");
      newFlap.classList.add("split-flap");
      newFlap.id = `flap-${row}-${col}`;
      newFlap.innerHTML = `
          <div class="card front">
              <div class="letter">${string[col] ?? " "}</div>
          </div>
          <div class="card back">
              <div class="letter">${string[col] ?? " "}</div>
          </div>
          <div class="card top">
              <div class="letter">${string[col] ?? " "}</div>
          </div>
          <div class="card bottom">
              <div class="letter">${string[col] ?? " "}</div>
          </div>
          `;
      newWrap.appendChild(newFlap);
  
      splitFlaps.push(
        new SplitFlap({
          id: `flap-${row}-${col}`,
        })
      );
    }
    console.log(`Added row with string ${string}`)
}

  if(NUMBER_OF_FLAPS !== 10) {
    resizeSplitFlaps(NUMBER_OF_FLAPS);
  }

  if(animate) {
    setTimeout(() => {
      let now = new Date();
      const remainingTime = targetDate - now;
  
      if(remainingTime > 0) {
        const timeString = getTimeString(remainingTime);
  
        animateSplitFlapsToString(timeString, splitFlaps);
      }
  
      beginCountdown();
    }, 1000);
  }



  function beginCountdown() {
    console.log("begin countdown");
    let refreshIntervalId = setInterval(() => {
      let now = new Date();

      const remainingTime = targetDate - now;
      console.log(remainingTime)
      if (remainingTime < 0) {
        let dateStr = " ABFAHRT! ";
        animateSplitFlapsToString(dateStr, splitFlaps);
        clearInterval(refreshIntervalId);
        // for (let i = 0; i < dateStr.length; ++i) {
        //   splitFlaps[i + 1].to(dateStr[i]);
        // }
        return;
      }
      // splitFlaps[0].to(" ");
      // splitFlaps[9].to(" ");

      let dateStr = getTimeString(remainingTime);
      for (let i = 0; i < dateStr.length; ++i) {
        if(i > splitFlaps.length - 1) {
          console.log(`String too long: ${dateStr}`);
          break;
        }
        splitFlaps[i].to(dateStr[i]);
      }
    }, 1000);
  }
});

window.addEventListener("resize", function () {
  if(numberOfFlaps !== undefined) {
    resizeSplitFlaps(numberOfFlaps);
  }
});

function resizeSplitFlaps(NUMBER_OF_FLAPS) {
  const margins = 0.5 * (NUMBER_OF_FLAPS + 1);
  const splitFlapWidth = (100 -  margins)/ NUMBER_OF_FLAPS;
  const stylesheet = document.styleSheets[0];
  console.log(stylesheet);
  const wrapSplitflapRule = [...stylesheet.cssRules].find(
    (r) => r.selectorText === ".wrap .split-flap"
  );
  wrapSplitflapRule.style.width = splitFlapWidth + "%";
  wrapSplitflapRule.style.paddingBottom = splitFlapWidth / 3 * 4 + "%";

  const wrapSplitflapCardLetterRule = [...[...stylesheet.cssRules].find(
    (r) => r.conditionText === "screen and (min-width: 769px)").cssRules].find(
      (r) => r.selectorText === ".wrap .split-flap .card .letter"
    );

  const wrapSplitflap = document.getElementById("flap-0-0");
  const wrapSplitflapCardLetter = [...[...wrapSplitflap.childNodes].find(
    (n) => n.className === "card front"
  ).childNodes].find(
    (n) => n.className === "letter"
  );

  fontSize = window.getComputedStyle(wrapSplitflapCardLetter).getPropertyValue('height');
  fontSize = fontSize.substring(0, fontSize.length - 2); // remove px
  fontSize = Math.floor(fontSize) + "px";
  wrapSplitflapCardLetterRule.style.fontSize = fontSize;
  console.log(wrapSplitflapCardLetterRule.style.fontSize);
}

function animateSplitFlapsToString(timeString, splitFlaps) {
  console.log("Animate to: " + timeString);
  const lettersNumbersSpecialChars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', ';', ':', ',', '<', '.', '>', '/', '?', '|', '\\', '`', '~'
  ];

  for (let i = 0; i < timeString.length; ++i) {
    if(i > splitFlaps.length - 1) {
      console.log(`String too long: ${dateStr}`);
      break;
    }
    let letter = timeString[i];
    let j = lettersNumbersSpecialChars.indexOf(splitFlaps[i].letter());
    while (letter !== lettersNumbersSpecialChars[j]) {
      ++j;
      if (j >= lettersNumbersSpecialChars.length) {
        j = 0;
      }
      splitFlaps[i].to(lettersNumbersSpecialChars[j], 10, 0);
    }

  }
}

function getTimeString(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (milliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  let dateStr = hoursStr + ":" + minutesStr + ":" + secondsStr;
  dateStr = dateStr.padStart(9, " ");
  dateStr = dateStr.padEnd(10, " ");
  return dateStr;
}

function setRows(dateStr, timeStr=null, eventLocation=null) {
  rows = []
  rows.push({
    string: dateStr,
    animate: true,
  });

  if (timeStr !== null && eventLocation !== null) {
    rows.push({
      string: timeStr,
      animate: false,
    });

    const words = eventLocation.split(" ");
    const segments = splitWords(words);

    for (let i = 0; i < segments.length; ++i) {
      const segment = segments[i];

      rows.push({
        string: i === 0 ? `@${segment}` : ` ${segment}`,
        animate: false,
      });
    }
}

  return rows;
}

function splitWords(words) {
  const maxLength = 10;
  let segments = [];
  let currentSegment = '';

  for(let i = 0; i < words.length -1; ++i) {
    words[i] += " ";
  }

  for (const word of words) {
    if (currentSegment.length + word.length <= maxLength) {
      currentSegment += word;
    } else {
      if (word.length > maxLength) {
        const remainingSpace = maxLength - currentSegment.length;
        currentSegment += word.slice(0, remainingSpace);
        segments.push(currentSegment);
        let remainingWord = word.slice(remainingSpace);

        while (remainingWord.length > maxLength) {
          segments.push(remainingWord.slice(0, maxLength));
          remainingWord = remainingWord.slice(maxLength);
        }
        currentSegment = remainingWord;
      } else {
        segments.push(currentSegment);
        currentSegment = word;
      }
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}