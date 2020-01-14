// get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const currentTimestamp = player.querySelector('.timestamp');

let mousedown = false;

// build functions
function togglePlay() {
  // calls play or pause on video
  const method = video.paused ? 'play' : 'pause';
  video[method]();

  // above is same as below:

  // if (video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }
}

function updateToggleButton() {
  // this = video because event listener is bound to video
  icon = this.paused ? '►': '▮▮';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(e) {
  const { name, value } = e.target
  video[name] = value;
  // when using change event with bound access to "this"
  // video[this.name] = this.value;
}

function toHHMMSS(rawSecs) {
  const roundedSecs = Math.round(parseInt(rawSecs,10));
  let hours   = Math.floor(roundedSecs / 3600);
  let minutes = Math.floor((roundedSecs - (hours * 3600)) / 60);
  let seconds = roundedSecs - (hours * 3600) - (minutes * 60);

  if (minutes < 10) {minutes = "0" + minutes;}
  if (seconds < 10) {seconds = "0" + seconds;}

  if (hours > 0) {
    if (hours < 10) {hours = "0" + hours;}
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

function handleProgress() {
  // find percentage of video watched at current time
  const percent = (video.currentTime / video.duration) * 100;
  // update flex-basis property of div
  progressBar.style.flexBasis = `${percent}%`;
  currentTimestamp.textContent = toHHMMSS(video.currentTime);
}

function scrub(e) {
  // calc video time based on pixel percentage at click
  // const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateToggleButton);
video.addEventListener('pause', updateToggleButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach((sb) => {
  sb.addEventListener('click', skip);
});
// make sure event type is change here - click would be the value on click
// can change this to update in realtime by using mousemove event and flags like canvas example
ranges.forEach((rb) => {
  rb.addEventListener('mousemove', (e) => {mousedown && handleRangeUpdate(e)});
  rb.addEventListener('mousedown', () => mousedown = true);
  rb.addEventListener('mouseup', () => mousedown = false);
});

// progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => {mousedown && scrub(e)});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
