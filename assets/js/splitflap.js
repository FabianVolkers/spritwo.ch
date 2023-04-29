function SplitFlap(opts)
{
  var self = this;
  self[0] = typeof opts.id === 'string' ? document.getElementById(opts.id) : opts.id;
  var _elm = self[0];
  var _cardFrontLetter  = _elm.querySelector('.card.front .letter');
  var _cardBackLetter   = _elm.querySelector('.card.back .letter');
  var _cardTopLetter    = _elm.querySelector('.card.top .letter');
  var _cardBottomLetter = _elm.querySelector('.card.bottom .letter');
  var _animationTime    = 1000; // in ms
  var _animationDelayTime = 5; // in ms; time between to animations waiting 
  var _animationStack   = []; // stores letter if animation is already started
  var _animationRunning = false; // is true if we do an animation
  var _animationClassName = 'do-flap';
  
  self.to = function(letter) {
    if(_animationRunning === true)
    {
      _animationStack.push(letter);
    }
    else if(letter === self.letter())
    {
      if(_animationStack.length > 0)
      {
        self.to(_animationStack.shift());
      }
    }
    else
    {
      _animationRunning = true;
      _cardTopLetter.innerText = letter;
      _cardBackLetter.innerText = letter;
      
      // set transision active to elements
      _cardFrontLetter.parentNode.style.transition = 'transform '+_animationTime+'ms';
      _cardBackLetter.parentNode.style.transition = 'transform '+_animationTime+'ms';
      
      // do animation
      window.requestAnimationFrame(() => {
        _elm.classList.add(_animationClassName);
        setTimeout(() => {
          // remove transision active to elements
          _cardFrontLetter.parentNode.style.transition = '';
          _cardBackLetter.parentNode.style.transition = '';
          
          window.requestAnimationFrame(() => {
            
            _cardFrontLetter.innerText = letter;
            _cardBottomLetter.innerText = letter;
            
            _elm.classList.remove(_animationClassName);
            window.requestAnimationFrame(() => {
              _animationRunning = false;
              if(_animationStack.length > 0)
              {
                self.to(_animationStack.shift());
              }
            });
          });
        }, _animationTime + _animationDelayTime);
      });
    }
  }
  
  self.letter = function(){
    return _cardFrontLetter.innerText;
  }
}

let splitFlaps = [];

for(let i = 0; i < 8; ++i)
{
  splitFlaps.push(new SplitFlap({
    id: 'flap-'+i
  }));
}

setInterval(() => {
  let now = new Date();
  let hours = ('0' + now.getHours()).substr(-2);
  let minutes = ('0' + now.getMinutes()).substr(-2);
  let seconds = ('0' + now.getSeconds()).substr(-2);
  
  let dateStr = hours + ':' + minutes + ':' + seconds;
  for(let i = 0; i < dateStr.length; ++i)
  {
    splitFlaps[i].to(dateStr[i]);
  }
}, 1000);