const paramsString = window.location.href;
const searchParams = new URLSearchParams(paramsString);
const url =
  window.location.protocol + "//" + window.location.hostname + "/?redirect";
const redirectUrl = searchParams.get(url);

const container = document.getElementById("container");
let target = document.getElementById("title");

function generateCode() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 9; i++) {
    code += chars.charAt((Math.random() * chars.length) >>> 0);
  }
  return code;
}

let a = document.createElement("button");
a.type = "button";
a.textContent = `https://www.youtube.com/watch?v=a${generateCode()}Q`;

let b = document.createElement("button");
b.type = "button";
b.textContent = `https://www.youtube.com/watch?v=a${generateCode()}Q`;

const correct = "https://www.youtube.com/watch?v=a3Z7zEc7AXQ";

let c = document.createElement("button");
c.type = "button";
c.textContent = correct;


let append = (parent, e) => {
  parent.insertAdjacentElement("afterend", e);
};

// fisher-yates shuffle from https://bost.ocks.org/mike/shuffle/

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let elements = shuffle([a, b, c]);

for (let el of elements) {
  el.onclick = () => {
    if (el.innerHTML === correct) {
      document.getElementById("caption").textContent =
        "You chose wrong... too bad";
      setTimeout(() => {
        window.location.href = correct;
      }, 2);
    } else {
      advance();
    }
  };
  append(target, el);
}

elements = null;

let advance = () => {
  for (el of [a, b, c]) {
    el.parentNode.removeChild(el);
  }
  const caption = document.getElementById("caption");
  caption.parentNode.removeChild(caption);

  let d = document.getElementById("second");
  d.style.position = "relative";
  d.style.visibility = "visible";
  d.style.top = "0px";

  // shuffle the images
  const i1 = document.createElement("img");
  i1.src = "images/0.png";
  const i2 = document.createElement("img");
  i2.src = "images/1.png";
  const i3 = document.createElement("img");
  i3.src = "images/2.png";

  const second = document.getElementById("second");
  let shuffledImages = shuffle([i1, i2, i3]);
  console.log(shuffledImages);
  for (const img of shuffledImages) {
    second.appendChild(img);
  }

  let imgElements = document.getElementsByTagName("img");

  let dragElement;

  for (let img of imgElements) {
    img.draggable = "true";
    img.style.cursor = "move";

    // swap el positions
    // https://stackoverflow.com/a/52446165/14738189
    function swapElements(el1, el2) {
      let prev1 = el1.previousSibling;
      let prev2 = el2.previousSibling;

      prev1.after(el2);
      prev2.after(el1);
    }

    let ondrop = (e) => {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      if (dragElement !== img) {
        console.log("continuing");

        swapElements(img, dragElement);
      }

      return false;
    };
    let ondragstart = (e) => {
      dragElement = img;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", img.outerHTML);
    };
    let ondragend = () => {
      for (let img of imgElements) {
        img.classList.remove("over");
      }
    };
    let ondragleave = () => {
      img.classList.remove("over");
    };
    let ondragenter = (e) => {
      // console.log('ayo');
      img.classList.add("over");
    };
    let ondragover = (e) => {
      e.preventDefault();
      // e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = "move";

      return false;
    };

    img.addEventListener("dragleave", ondragleave, false);

    img.addEventListener("dragstart", ondragstart, false);

    img.addEventListener("dragover", ondragover, false);
    img.addEventListener("dragenter", ondragenter, false);
    img.addEventListener("drop", ondrop, false);
  }
};

const du = document.getElementById("du");
let counter;
let video = document.getElementById("if");
let audio = document.createElement("Audio");
let button2 = document.getElementById("verify2");

let onAudioShouldBeEnded = () => {
  audio.pause();
  clearInterval(counter);
  counter = null;
  du.textContent = `duration left: 0s`;
  video.pause();
  button2.style["pointer-events"] = "None";
  button2.textContent = "verified️️ ✔️";
  if (redirectUrl) {
    button2.textContent += "; redirecting";
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1200);
  }else{
	button2.textContent += " but no redirect url was specified";
  }
};
document.getElementById("verify1").onclick = () => {
  // check order
  let imgElements = document.getElementsByTagName("img");
  let order = {
    "images/0.png": 0, // 1
    "images/1.png": 1, // 2
    "images/2.png": 2, // 3
  };

  // let correct = false;
  // in order; first to last as visible
  for (let i = 0; i < 3; ++i) {
    // console.log(imgElements[i].src);
    let img = imgElements[i];
    if (!img.src.includes(`${i}.png`)) {
      document.getElementById("arranging").textContent =
        "You arranged the images incorrectly! ";
      setInterval(() => {
        window.location.href = correct;
      }, 2000);
      return;
    }
  }

  second.parentNode.removeChild(second);
  let d = document.getElementById("third");
  d.style.position = "relative";
  d.style.visibility = "visible";
  d.style.top = "0px";

  // this is within an onclick handler, therefore
  // chrome will only play the video because consent was 'given' by the user (clicking a button)

  video.play();
  button2.onclick = () => {
    if (audio.currentTime < 60) {
      // display 60 hours now
      video.loop = "true";
      audio.loop = "true";
      button2.style["background-color"] = "#ff0000";
      button2.innerHTML = `<del>verify</del>`;
      button2.style["pointer-events"] = "None";
      target.style.color = "#ff0000";
      video.style.filter = "saturate(8)";
      clearInterval(counter);
      counter = null;
      document.getElementById("info").textContent =
        "you should have waited before clicking verify.";
      du.textContent = "duration left: ∞";
    }
  };
};

let num = 61;
counter = setInterval(() => {
  if (num === 0) {
    clearInterval(counter);
    counter = null;
    // we don't even need onended for the audio
    // we can just do it here
    onAudioShouldBeEnded();
  }
  du.textContent = `duration left: ${num}s`;
  num -= 1;
}, 1000);
