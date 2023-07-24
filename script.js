// music
const music = [
  {
    audioPath: "audios/footsteps-stone.mp3",
    imagePath: "images/pavement.jpg",
    musicName: "Footsteps",
  },
  {
    audioPath: "audios/water-pour.mp3",
    imagePath: "images/water-drops.jpg",
    musicName: "Water",
  },
  {
    audioPath: "audios/howling-wind.mp3",
    imagePath: "images/canola-in-the-wind.jpg",
    musicName: "Wind",
  },
];

// icons
const icons = {
  play: "icons/play.png",
  pause: "icons/pause.png",
  rewind: "icons/rewind.png",
  fastForward: "icons/fast-forward.png",
};

// function to convert seconds to mm:ss format
function convertTime(seconds) {
  seconds = Math.floor(seconds);
  const mins = Math.floor(seconds / 60);
  seconds %= 60;
  const secs = seconds < 10 ? `0${seconds}` : seconds;
  return `${mins}:${secs}`;
}

// loadmusic method loads the current music
const body = document.querySelector("body");
const musicImgElement = document.querySelector("#music-img");
const musicNameElement = document.querySelector("#audio-name");
const currentTimeElement = document.querySelector("#current-time");
const musicProgressBar = document.querySelector("#music-progress-bar");
let musicIndex = 0;
let currentAudio = new Audio();
let currentDuration = 0;
function loadMusic() {
  currentAudio = new Audio(`${music[musicIndex].audioPath}`);
  body.style.backgroundImage = `url(${music[musicIndex].imagePath})`;
  musicImgElement.style.backgroundImage = `url(${music[musicIndex].imagePath})`;
  musicNameElement.innerHTML = `${music[musicIndex].musicName}`;
  currentTimeElement.innerHTML = "0:00";
  musicProgressBar.value = "0";

  // code to get current audio duration (stack overflow)
  var getDuration = function (url, next) {
    var _player = new Audio(url);
    _player.addEventListener(
      "durationchange",
      function (e) {
        if (this.duration != Infinity) {
          var duration = this.duration;
          _player.remove();
          next(duration);
        }
      },
      false
    );
    _player.load();
    _player.currentTime = 24 * 60 * 60; //fake big time
    _player.volume = 0;
    _player.play();
    //waiting...
  };

  getDuration(music[musicIndex].audioPath, function (duration) {
    currentDuration = duration;
    const durationElement = document.querySelector("#duration");
    durationElement.innerHTML = convertTime(currentDuration);
  });
}

// event listener for play/pause button
const playPauseBtn = document.querySelector("#play-pause");
playPauseBtn.addEventListener("click", () => {
  if (currentAudio.paused) {
    playPauseBtn.src = `${icons.pause}`;
    currentAudio.play();
  } else {
    playPauseBtn.src = `${icons.play}`;
    currentAudio.pause();
  }
});

// event listener for rewind button
const rewindBtn = document.querySelector("#rewind");
rewindBtn.addEventListener("click", () => {
  musicIndex--;
  musicIndex += music.length;
  musicIndex %= music.length;
  currentAudio.currentTime = 0;
  currentAudio.pause();
  playPauseBtn.src = `${icons.play}`;
  loadMusic();
});

// event listener for fast-forward button
const fastForwardBtn = document.querySelector("#fast-forward");
fastForwardBtn.addEventListener("click", () => {
  musicIndex++;
  musicIndex %= music.length;
  currentAudio.currentTime = 0;
  currentAudio.pause();
  playPauseBtn.src = `${icons.play}`;
  loadMusic();
});

// changing progress-bar and current-time when music is playing
setInterval(() => {
  if (currentAudio.paused) {
    return;
  }
  let t = currentAudio.currentTime;
  currentTimeElement.innerHTML = convertTime(t);
  musicProgressBar.value = (t / currentDuration) * 100;
}, 1000);

// changing current-time when progress-bar is changed using mouse
musicProgressBar.addEventListener("change", () => {
  const t = (musicProgressBar.value / 100) * currentDuration;
  currentAudio.currentTime = t;
  currentTimeElement.innerHTML = convertTime(t);
});

loadMusic();
