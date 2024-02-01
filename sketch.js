let songPath = "star_sleep_mix.mp3";
let albumArtPath = "cover.jpg";
let song;
let fft;
let freqData;
let albumArt;
let isSpinning = false;
let freqMulti;
let waveMulti;
let songs;
let stars = [];
let numOfStars;
let stWt;
let freqStatus;
let freqCount;

function preload() {
  //load song before drawing starts
  albumArt = loadImage(albumArtPath)
  song = loadSound(songPath)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfStars = 100;
  stWt = 1;
  freqStatus = false;
  freqCount = 0;
  for (let i = 0; i < numOfStars; i++) {
    coords = createVector(random(width), random(height/2));
    stars.push(coords);
  }
  angleMode(DEGREES);
  // read waveforms
  fft = new p5.FFT();
  // let song1 = {
  //   path: "star_sleep_mix.mp3",
  //   albumArtPath: "cover.jpg",
  //   text: "heize"
  // }
  // let song2 = {
  //   path: "",
  //   albumArtPath: "",
  //   text: ""
  // }
  // let song3 = {
  //   path: "",
  //   albumArtPath: "",
  //   text: ""
  // }

  // let songs = [song1, song2, song3]
}

function draw() {
  background(10, 3, 30);
  drawBackground();
  stroke(255);
  push();
  translate(0, height/2);
  drawStars(stWt);
  pop()
  count = 0;
  // creates array of numbers ranging from -1.0, to 1.0
  let waveformData = fft.waveform();
  // array of frequencies, ranges from 0 to 255
  let freqData = fft.analyze();
  // let freqAvg = sum(freqData.slice(0, freqData.length/2)); 

  noFill();
  
  //bottom freq line
  beginShape();
  for (let i = 0; i < width; i++) {
    let freqIndex = floor(map(i, 0, width, 0, freqData.length/2));
    strokeWeight(10);
    let freqX = i;
    freqVal = map(freqData[freqIndex], 0, 255, 0, 1);
    if (freqVal < 0.55 && freqVal > 0.2) { count ++ };
    if (count > freqData.length / 4) { 
      freqStatus = true
    } else { freqStatus = false }
    stroke(getFreqColor(freqVal));
    let freqY  = freqVal * 100 + height/2;
    curveVertex(freqX, freqY);
  }
  endShape();

  //bottom of circle
  push();
  translate(width/2, height/2);
  rotate(90);
  beginShape();
  for (let i = 0; i <= 180; i++) {
    let idx = floor(map(i, 0, 180, 0, waveformData.length - 1));
    let r = map(waveformData[idx], -1, 1, 150, 350); // last two are the min and max radius
    maxWave = max(waveformData);
  
    newCol = getWaveColor(maxWave);
    stWt = map(maxWave, 0, 1, .5, 2.5);
    
    let x = r * sin(i);
    let y = r * cos(i);
    if (freqStatus) {
      stroke(50, 200, 200);
      point(x*1.5, y*1.5);
    }
    strokeWeight(map(maxWave, 0, 1, 3, 20) );
    stroke(newCol);
    curveVertex(x, y);
  }
  endShape();
  pop();
  filter(BLUR);
  
  //top freq line
  beginShape();
  for (let i = 0; i < width; i++) {
    let freqIndex = floor(map(i, 0, width, 0, freqData.length/2));
    strokeWeight(10);
    let freqX = i;
    freqVal = map(freqData[freqIndex], 0, 255, 0, 1);
    stroke(getFreqColor(freqVal));
    let freqY  = freqVal * -100 + height/2;
    curveVertex(freqX, freqY);
  }
  endShape();

    //top of circle
    push();
    translate(width/2, height/2);
    rotate(90);
    beginShape();
    for (let i = 0; i <= 180; i++) {
      let idx = floor(map(i, 0, 180, 0, waveformData.length - 1));
      var r = map(waveformData[idx], -1, 1, 150, 350); // last two are the min and max radius
      maxWave = max(waveformData);
      newCol = getWaveColor(maxWave);
      strokeWeight(map(maxWave, 0, 1, 3, 20) );
      var x = r * -sin(i);
      var y = r * cos(i);
      if (freqStatus) {
        stroke(50, 200, 200);
        point(x * 1.5, y * 1.5)
      }
      stroke(newCol);
      curveVertex(x, y);
    }
    endShape();
    pop();

  // place album art and text
  albumArt.resize(height/5, 0)
  image(albumArt, width/10, height * .75);
  strokeWeight(1);
  fill(200);
  stroke(255);
  textSize(20);
  text("heize - star (sleep mix)", (width/10 + 20 + height/5), (height * .75 + height/10));
  
  drawStars(stWt);

}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    isSpinning = false;
    noLoop();
  } else {
    song.play();
    isSpinning = true;
    loop();
  }
}

function getWaveColor(maxWaveVal) {
  blueVal = map(maxWaveVal, 0, 1, 100, 255);
  greenVal = map(maxWaveVal, 0, 1, 7, 60);
  redVal = map(maxWaveVal, 0, 1, 40, 150);

  return color(redVal, greenVal, blueVal);
}

function getFreqColor(freqWaveVal) {
  blueVal = map(freqWaveVal, 0, 1, 100, 150);
  greenVal = map(freqWaveVal, 0, 1, 40, 80);
  redVal = map(freqWaveVal, 0, 1, 130, 255);

  return color(redVal, greenVal, blueVal);
}


function drawBackground() {
  noStroke();
  fill(10, 3, 30);
  rect(0, 0, width, height/2);
  fill(20, 6, 60);
  rect(0, height/2, width, height/2);
}

function drawStars(strokeWt) {
  strokeWeight(strokeWt);
  for (let i = 0; i <numOfStars; i++) {
    point(stars[i].x, stars[i].y);
  }
}
