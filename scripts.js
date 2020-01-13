// get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

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

function handleRangeUpdate() {
  // this.name will be either "volume" or "playbackRate"
  video[this.name] = this.value;
}

function handleProgress() {
  // find percentage of video watched at current time
  const percent = (video.currentTime / video.duration) * 100;
  // update flex-basis property of div
  progressBar.style.flexBasis = `${percent}%`;
}

let isScrubbing = false;

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
  rb.addEventListener('change', handleRangeUpdate);
});
// progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => {isScrubbing && scrub(e)});
progress.addEventListener('mousedown', (e) => {isScrubbing = true});
progress.addEventListener('mouseup', () => isScrubbing = false);
