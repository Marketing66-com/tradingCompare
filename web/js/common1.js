var speed = 5;

canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var color = '#2af';
var width1 = /*canvas.width*/ 100;
canvas.height1 = /*width*/  100;
var height1 = /*canvas.height*/ 100;
var percent = 9.5;
var percent2 = percent * 10;
var counter = 0;

function baseCir() {
    ctx.beginPath();
    ctx.lineWidth = width1 / 14;
    ctx.strokeStyle = "#e2e2e2";
    ctx.arc(width1 / 2, width1 / 2, width1 / 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

setTimeout(function draw() {

    var angle = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx.clearRect(0, 0, width1, height1);
    baseCir();
    ctx.beginPath();
    ctx.lineWidth = width1 / 14;
    ctx.arc(width1 / 2, width1 / 2, width1 / 3, 1.5 * Math.PI, angle);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();


    ctx.fillStyle = color;
    ctx.font = width1 / 6 + "px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.fillText( percent + "", width / 2, width / 2 );
    ctx.transform = "rotate(90deg)";
    ctx.fillText(status, width1 / 2, height1 - 25);
    counter++;
    if (counter <= percent2) {
        setTimeout(draw, speed);
    }
}, 200);

canvas3 = document.getElementById("canvas3");
var ctx3 = canvas3.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 70;
canvas3.height = /*width*/  70;
var height = /*canvas.height*/ 70;
var percent_3 = 9.8;
var percent3 = percent_3 * 10;
var counter3 = 0;


function baseCir3() {
    ctx3.beginPath();
    ctx3.lineWidth = width / 14;
    ctx3.strokeStyle = "#e2e2e2";
    ctx3.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx3.stroke();
    ctx3.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter3 / 100;
    ctx3.clearRect(0, 0, width, height);
    baseCir3();
    ctx3.beginPath();
    ctx3.lineWidth = width / 14;
    ctx3.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx3.strokeStyle = color;
    ctx3.stroke();
    ctx3.closePath();

    ctx3.fillStyle = color;
    ctx3.font = width / 6 + "px Arial";
    ctx3.textAlign = 'center';
    ctx3.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx3.transform = "rotate(90deg)";
    ctx3.fillText(status, width / 2, height - 25);
    counter3++;
    if (counter3 <= percent3) {
        setTimeout(draw, speed);
    }
}, 200);

canvas4 = document.getElementById("canvas4");
var ctx4 = canvas4.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 70;
canvas4.height = /*width*/  70;
var height = /*canvas.height*/ 70;
var percent_4 = 9.5;
var percent4 = percent_4 * 10;
var counter4 = 0;


function baseCir4() {
    ctx4.beginPath();
    ctx4.lineWidth = width / 14;
    ctx4.strokeStyle = "#e2e2e2";
    ctx4.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx4.stroke();
    ctx4.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter4 / 100;
    ctx4.clearRect(0, 0, width, height);
    baseCir4();
    ctx4.beginPath();
    ctx4.lineWidth = width / 14;
    ctx4.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx4.strokeStyle = color;
    ctx4.stroke();
    ctx4.closePath();

    ctx4.fillStyle = color;
    ctx4.font = width / 6 + "px Arial";
    ctx4.textAlign = 'center';
    ctx4.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx4.transform = "rotate(90deg)";
    ctx4.fillText(status, width / 2, height - 25);
    counter4++;
    if (counter4 <= percent4) {
        setTimeout(draw, speed);
    }
}, 200);

canvas5 = document.getElementById("canvas5");
var ctx5 = canvas5.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 70;
canvas5.height = /*width*/  70;
var height = /*canvas.height*/ 70;
var percent_5 = 9.0;
var percent5 = percent_5 * 10;
var counter5 = 0;


function baseCir5() {
    ctx5.beginPath();
    ctx5.lineWidth = width / 14;
    ctx5.strokeStyle = "#e2e2e2";
    ctx5.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx5.stroke();
    ctx5.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter5 / 100;
    ctx5.clearRect(0, 0, width, height);
    baseCir5();
    ctx5.beginPath();
    ctx5.lineWidth = width / 14;
    ctx5.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx5.strokeStyle = color;
    ctx5.stroke();
    ctx5.closePath();

    ctx5.fillStyle = color;
    ctx5.font = width / 6 + "px Arial";
    ctx5.textAlign = 'center';
    ctx5.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx5.transform = "rotate(90deg)";
    ctx5.fillText(status, width / 2, height - 25);
    counter5++;
    if (counter5 <= percent5) {
        setTimeout(draw, speed);
    }
}, 200);
