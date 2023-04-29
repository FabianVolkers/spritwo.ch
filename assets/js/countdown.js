document.addEventListener("DOMContentLoaded", function () {
    const targetDate = new Date(targetDateString);
    const countdown = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date();
        const remainingTime = targetDate - now;

        if (remainingTime < 0) {
            clearInterval(intervalId);
            countdown.textContent = "00 : 00 : 00";
            return;
        }

        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const hoursStr = String(hours).padStart(2, "0");
        const minutesStr = String(minutes).padStart(2, "0");
        const secondsStr = String(seconds).padStart(2, "0");

        document.getElementById("hours-0").setAttribute("data-value", hoursStr[0]);
        document.getElementById("hours-1").setAttribute("data-value", hoursStr[1]);
        document.getElementById("minutes-0").setAttribute("data-value", minutesStr[0]);
        document.getElementById("minutes-1").setAttribute("data-value", minutesStr[1]);
        document.getElementById("seconds-0").setAttribute("data-value", secondsStr[0]);
        document.getElementById("seconds-1").setAttribute("data-value", secondsStr[1]);

        // countdown.innerHTML = `
        //     <div class="time-part hours">
        //         <div id="hours-0" class="flip" data-value="${hoursStr[0]}">${hoursStr[0]}</div>
        //         <div id="hours-1" class="flip" data-value="${hoursStr[1]}">${hoursStr[1]}</div>
        //     </div>
        //     <div class="time-part minutes">
        //         <div id="minutes-0" class="flip" data-value="${minutesStr[0]}">${minutesStr[0]}</div>
        //         <div id="minutes-1" class="flip" data-value="${minutesStr[1]}">${minutesStr[1]}</div>
        //     </div>
        //     <div class="time-part seconds">
        //         <div class="flip" data-value="${secondsStr[0]}">${secondsStr[0]}</div>
        //         <div class="flip" data-value="${secondsStr[1]}">${secondsStr[1]}</div>
        //     </div>
        // `;

        // Animate flip only if the number has changed
        countdown.querySelectorAll(".flip").forEach(function (flip) {
            const value = flip.getAttribute("data-value");

           
            if (flip.textContent !== value) {
                console.log(value, flip.textContent);
                flip.textContent = value;
                flip.classList.add("animate");
                console.log("animate");
                setTimeout(function () {
                    flip.classList.remove("animate");
                }, 500);
                
            } else {
                console.log("no animate");
                flip.classList.remove("animate");
            }
        });
    }

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();
});
