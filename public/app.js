//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});


// p5 code------------------------------------------------------------------
let test1;
let imgW;
let imgH;
let myR;
let myG;
let myB;

function preload() {
    let dataset = 'data.json';
    test1 = loadJSON(dataset);
    console.log(test1);
}

function setup() {

    myR = random(255);
    myG = random(255);
    myB = random(255);

    let children = test1.data.children;
    let validImageInfo = [];

    // -------------------code from chatgpt-----start--------------------------
    // Function to check if a URL is a valid JPG or PNG
    function isValidImageUrl(url) {
        return /\.(jpg|jpeg|png)$/i.test(url);
    }

    // Iterate through child posts and add valid image URLs with their titles to the array
    children.forEach(function (child) {
        if (isValidImageUrl(child.data.url)) {
            validImageInfo.push({
                url: child.data.url,
                // -------------------code from chatgpt----------end---------------------
                title: child.data.title,
                artist: child.data.link_flair_richtext[0].t
            });
        }
    });

    console.log(validImageInfo);

    let currentIndex = 0;

    function display(index) {
        let validItem = validImageInfo[index];

        // image url -> dom
        let dispImg = document.getElementById('img');
        dispImg.src = validItem.url;

        //artist name -> dom
        let dispName = document.getElementById('name');
        dispName.innerHTML = validItem.artist;

        // img url -> dom
        let dispUrl = document.getElementById('link');
        dispUrl.href = validItem.url;

        // title -> dom
        let dispTitle = document.getElementById('title');
        dispTitle.innerHTML = validItem.title;

        // image size- width and height
        imgW = document.getElementById('img').width;
        // console.log(imgW);
        imgH = document.getElementById('img').height;
        // console.log(imgH);
    }

    display(currentIndex);

    let canvas = createCanvas(imgW, imgH);
    // background(0, 199, 40, 30)
    canvas.parent('canvasForHTML');

    // button to move to the next element
    button = document.getElementById('nextB');
    button.addEventListener('click', function () {
        currentIndex = currentIndex + 1;
        if (currentIndex == validImageInfo.length) {
            currentIndex = 0
        }
        display(currentIndex);
    });

    //inside setup is a good place
    //Listen for a message named 'data' from the server
    socket.on('dataAll', (obj) => {
        console.log(obj);
        drawPos(obj);
    });

}

function draw() {
}

function keyPressed() {
    if (key === 'e') {
        clear();
    //reset canvas size to current image size
    imgW = document.getElementById('img').width;
    imgH = document.getElementById('img').height;
    resizeCanvas(imgW, imgH)
    }
}

function mouseDragged() {

    //grab mouse position
    let mousePos = { x1: pmouseX, y1: pmouseY, x2: mouseX, y2: mouseY, r: myR, g: myG, b: myB };
    socket.emit('data', mousePos);

}

//Expects an object with x and y properties
function drawPos(pos) {

    line(pos.x1, pos.y1, pos.x2, pos.y2);
    stroke(pos.r, pos.g, pos.b);
    strokeWeight(random(1,4));
  }


function windowResized() {
    imgW = document.getElementById('img').width;
    imgH = document.getElementById('img').height;
    resizeCanvas(imgW, imgH)
    // background(0, 199, 40, 30)
}