canvas = document.getElementById("canvas-0");
var ctx = canvas.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent = 9.6
var percent2 = percent * 10;
var counter = 0;

function baseCir() {
    ctx.beginPath();
    ctx.lineWidth = width / 14;
    ctx.strokeStyle = "#e2e2e2";
    ctx.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

setTimeout(function draw() {

    var angle = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx.clearRect(0, 0, width, height);
    baseCir();
    ctx.beginPath();
    ctx.lineWidth = width / 14;
    ctx.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();


    ctx.fillStyle = color;
    ctx.font = width / 6 + "px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.fillText( percent + "", width / 2, width / 2 );
    ctx.transform = "rotate(90deg)";
    ctx.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent2) {
        setTimeout(draw, 20);
    }
}, 200);

canvas3 = document.getElementById("canvas-3");
var ctx3 = canvas3.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas3.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_3 = 9.6;
var percent3 = percent_3 * 10;
var counter = 0;


function baseCir3() {
    ctx3.beginPath();
    ctx3.lineWidth = width / 14;
    ctx3.strokeStyle = "#e2e2e2";
    ctx3.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx3.stroke();
    ctx3.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
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
    counter++;
    if (counter <= percent3) {
        setTimeout(draw, 20);
    }
}, 200);

canvas4 = document.getElementById("canvas-4");
var ctx4 = canvas4.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas4.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_4 = 8.5;
var percent4 = percent_4 * 10;
var counter = 0;
var counter3 = 0;

function baseCir4() {
    ctx4.beginPath();
    ctx4.lineWidth = width / 14;
    ctx4.strokeStyle = "#e2e2e2";
    ctx4.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx4.stroke();
    ctx4.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx4.clearRect(0, 0, width, height);
    baseCir4();
    ctx4.beginPath();
    ctx4.lineWidth = width / 14;
    ctx4.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx4.strokeStyle = color;
    ctx4.stroke();

    ctx4.fillStyle = color;
    ctx4.font = width / 6 + "px Arial";
    ctx4.textAlign = 'center';
    ctx4.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx4.transform = "rotate(90deg)";
    ctx4.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent4) {
        setTimeout(draw, 20);
    }
}, 200);


canvas5 = document.getElementById("canvas-5");
var ctx5 = canvas5.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas4.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_5 = 8.5;
var percent5 = percent_5 * 10;
var counter = 0;


function baseCir5() {
    ctx5.beginPath();
    ctx5.lineWidth = width / 14;
    ctx5.strokeStyle = "#e2e2e2";
    ctx5.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx5.stroke();
    ctx5.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx5.clearRect(0, 0, width, height);
    baseCir5();
    ctx5.beginPath();
    ctx5.lineWidth = width / 14;
    ctx5.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx5.strokeStyle = color;
    ctx5.stroke();

    ctx5.fillStyle = color;
    ctx5.font = width / 6 + "px Arial";
    ctx5.textAlign = 'center';
    ctx5.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx5.transform = "rotate(90deg)";
    ctx5.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent5) {
        setTimeout(draw, 20);
    }
}, 200);

canvas6 = document.getElementById("canvas-6");
var ctx6 = canvas6.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas6.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_6 = 9;
var percent6 = percent_6 * 10;
var counter = 0;


function baseCir6() {
    ctx6.beginPath();
    ctx6.lineWidth = width / 14;
    ctx6.strokeStyle = "#e2e2e2";
    ctx6.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx6.stroke();
    ctx6.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx6.clearRect(0, 0, width, height);
    baseCir6();
    ctx6.beginPath();
    ctx6.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx6.strokeStyle = color;
    ctx6.stroke();

    ctx6.fillStyle = color;
    ctx6.font = width / 6 + "px Arial";
    ctx6.textAlign = 'center';
    ctx6.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx6.transform = "rotate(90deg)";
    ctx6.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent6) {
        setTimeout(draw, 20);
    }
}, 200);


canvas7 = document.getElementById("canvas-7");
var ctx7 = canvas7.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas7.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_7 = 9;
var percent7 = percent_7 * 10;
var counter = 0;


function baseCir7() {
    ctx7.beginPath();
    ctx7.lineWidth = width / 14;
    ctx7.strokeStyle = "#e2e2e2";
    ctx7.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx7.stroke();
    ctx7.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx7.clearRect(0, 0, width, height);
    baseCir7();
    ctx7.beginPath();
    ctx7.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx7.strokeStyle = color;
    ctx7.stroke();

    ctx7.fillStyle = color;
    ctx7.font = width / 6 + "px Arial";
    ctx7.textAlign = 'center';
    ctx7.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx7.transform = "rotate(90deg)";
    ctx7.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent7) {
        setTimeout(draw, 20);
    }
}, 200);


canvas8 = document.getElementById("canvas-8");
var ctx8 = canvas8.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas8.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_8 = 7.5;
var percent8 = percent_8 * 10;
var counter = 0;


function baseCir8() {
    ctx8.beginPath();
    ctx8.lineWidth = width / 14;
    ctx8.strokeStyle = "#e2e2e2";
    ctx8.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx8.stroke();
    ctx8.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx8.clearRect(0, 0, width, height);
    baseCir8();
    ctx8.beginPath();
    ctx8.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx8.strokeStyle = color;
    ctx8.stroke();

    ctx8.fillStyle = color;
    ctx8.font = width / 6 + "px Arial";
    ctx8.textAlign = 'center';
    ctx8.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx8.transform = "rotate(90deg)";
    ctx8.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent8) {
        setTimeout(draw, 20);
    }
}, 200);
canvas9 = document.getElementById("canvas-9");
var ctx9 = canvas9.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas9.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_9 = 7.5;
var percent9 = percent_9 * 10;
var counter = 0;


function baseCir9() {
    ctx9.beginPath();
    ctx9.lineWidth = width / 14;
    ctx9.strokeStyle = "#e2e2e2";
    ctx9.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx9.stroke();
    ctx9.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx9.clearRect(0, 0, width, height);
    baseCir9();
    ctx9.beginPath();
    ctx9.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx9.strokeStyle = color;
    ctx9.stroke();

    ctx9.fillStyle = color;
    ctx9.font = width / 6 + "px Arial";
    ctx9.textAlign = 'center';
    ctx9.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx9.transform = "rotate(90deg)";
    ctx9.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent9) {
        setTimeout(draw, 20);
    }
}, 200);


canvas10 = document.getElementById("canvas-10");
var ctx10 = canvas10.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas10.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_10 = 7.8;
var percent10 = percent_10 * 10;
var counter = 0;


function baseCir10() {
    ctx10.beginPath();
    ctx10.lineWidth = width / 14;
    ctx10.strokeStyle = "#e2e2e2";
    ctx10.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx10.stroke();
    ctx10.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx10.clearRect(0, 0, width, height);
    baseCir10();
    ctx10.beginPath();
    ctx10.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx10.strokeStyle = color;
    ctx10.stroke();

    ctx10.fillStyle = color;
    ctx10.font = width / 6 + "px Arial";
    ctx10.textAlign = 'center';
    ctx10.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx10.transform = "rotate(90deg)";
    ctx10.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent10) {
        setTimeout(draw, 20);
    }
}, 200);


canvas11 = document.getElementById("canvas-11");
var ctx11 = canvas11.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas11.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_11 = 7.8;
var percent11 = percent_11 * 10;
var counter = 0;


function baseCir11() {
    ctx11.beginPath();
    ctx11.lineWidth = width / 14;
    ctx11.strokeStyle = "#e2e2e2";
    ctx11.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx11.stroke();
    ctx11.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx11.clearRect(0, 0, width, height);
    baseCir11();
    ctx11.beginPath();
    ctx11.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx11.strokeStyle = color;
    ctx11.stroke();

    ctx11.fillStyle = color;
    ctx11.font = width / 6 + "px Arial";
    ctx11.textAlign = 'center';
    ctx11.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx11.transform = "rotate(90deg)";
    ctx11.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent11) {
        setTimeout(draw, 20);
    }
}, 200);

/************************************************************/

canvas13 = document.getElementById("canvas-13");
var ctx13 = canvas13.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas13.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent13 = 9.1;
var percent13 = percent13 * 10;
var counter13 = 0;


function baseCir13() {
    ctx13.beginPath();
    ctx13.lineWidth = width / 14;
    ctx13.strokeStyle = "#e2e2e2";
    ctx13.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx13.stroke();
    ctx13.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter13 / 100;
    ctx13.clearRect(0, 0, width, height);
    baseCir13();
    ctx13.beginPath();
    ctx13.lineWidth = width / 14;
    ctx13.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx13.strokeStyle = color;
    ctx13.stroke();
    ctx13.closePath();

    ctx13.fillStyle = color;
    ctx13.font = width / 6 + "px Arial";
    ctx13.textAlign = 'center';
    ctx13.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx13.transform = "rotate(90deg)";
    ctx13.fillText(status, width / 2, height - 25);
    counter13++;
    if (counter13 <= percent13) {
        setTimeout(draw, 20);
    }
}, 200);


canvas12 = document.getElementById("canvas-12");
var ctx12 = canvas12.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas12.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_12 = 9.1;
var percent12 = percent_12 * 10;
var counter = 0;


function baseCir12() {
    ctx12.beginPath();
    ctx12.lineWidth = width / 14;
    ctx12.strokeStyle = "#e2e2e2";
    ctx12.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx12.stroke();
    ctx12.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx12.clearRect(0, 0, width, height);
    baseCir12();
    ctx12.beginPath();
    ctx12.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx12.strokeStyle = color;
    ctx12.stroke();

    ctx12.fillStyle = color;
    ctx12.font = width / 6 + "px Arial";
    ctx12.textAlign = 'center';
    ctx12.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx12.transform = "rotate(90deg)";
    ctx12.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent12) {
        setTimeout(draw, 20);
    }
}, 200);

/************************************************************/

canvas14 = document.getElementById("canvas-14");
var ctx14 = canvas14.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas14.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent14 = 9;
var percent14 = percent14 * 10;
var counter14 = 0;


function baseCir14() {
    ctx14.beginPath();
    ctx14.lineWidth = width / 14;
    ctx14.strokeStyle = "#e2e2e2";
    ctx14.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx14.stroke();
    ctx14.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter14 / 100;
    ctx14.clearRect(0, 0, width, height);
    baseCir14();
    ctx14.beginPath();
    ctx14.lineWidth = width / 14;
    ctx14.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx14.strokeStyle = color;
    ctx14.stroke();
    ctx14.closePath();

    ctx14.fillStyle = color;
    ctx14.font = width / 6 + "px Arial";
    ctx14.textAlign = 'center';
    ctx14.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx14.transform = "rotate(90deg)";
    ctx14.fillText(status, width / 2, height - 25);
    counter14++;
    if (counter14 <= percent14) {
        setTimeout(draw, 20);
    }
}, 200);


canvas15 = document.getElementById("canvas-15");
var ctx15 = canvas15.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas15.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_15 = 9;
var percent15 = percent_15 * 10;
var counter = 0;


function baseCir15() {
    ctx15.beginPath();
    ctx15.lineWidth = width / 14;
    ctx15.strokeStyle = "#e2e2e2";
    ctx15.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx15.stroke();
    ctx15.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx15.clearRect(0, 0, width, height);
    baseCir15();
    ctx15.beginPath();
    ctx15.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx15.strokeStyle = color;
    ctx15.stroke();

    ctx15.fillStyle = color;
    ctx15.font = width / 6 + "px Arial";
    ctx15.textAlign = 'center';
    ctx15.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx15.transform = "rotate(90deg)";
    ctx15.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent15) {
        setTimeout(draw, 20);
    }
}, 200);

/************************************************************/

canvas16 = document.getElementById("canvas-16");
var ctx16 = canvas16.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas16.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent16 = 7.8;
var percent16 = percent16 * 10;
var counter16 = 0;


function baseCir16() {
    ctx16.beginPath();
    ctx16.lineWidth = width / 14;
    ctx16.strokeStyle = "#e2e2e2";
    ctx16.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx16.stroke();
    ctx16.closePath();
}

setTimeout(function draw() {
    var angle = Math.PI * 1.5 + Math.PI * 2 * counter16 / 100;
    ctx16.clearRect(0, 0, width, height);
    baseCir16();
    ctx16.beginPath();
    ctx16.lineWidth = width / 14;
    ctx16.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle);
    ctx16.strokeStyle = color;
    ctx16.stroke();
    ctx16.closePath();

    ctx16.fillStyle = color;
    ctx16.font = width / 6 + "px Arial";
    ctx16.textAlign = 'center';
    ctx16.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx16.transform = "rotate(90deg)";
    ctx16.fillText(status, width / 2, height - 25);
    counter16++;
    if (counter16 <= percent16) {
        setTimeout(draw, 20);
    }
}, 200);


canvas17 = document.getElementById("canvas-17");
var ctx17 = canvas17.getContext('2d');
var color = '#2af';
var width = /*canvas.width*/ 100;
canvas17.height = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_17 = 7.8;
var percent17 = percent_17 * 10;
var counter = 0;


function baseCir17() {
    ctx17.beginPath();
    ctx17.lineWidth = width / 14;
    ctx17.strokeStyle = "#e2e2e2";
    ctx17.arc(width / 2, width / 2, width / 3, 0, Math.PI * 2);
    ctx17.stroke();
    ctx17.closePath();
}

setTimeout(function draw() {
    var angle2 = Math.PI * 1.5 + Math.PI * 2 * counter / 100;
    ctx17.clearRect(0, 0, width, height);
    baseCir17();
    ctx17.beginPath();
    ctx17.arc(width / 2, width / 2, width / 3, 1.5 * Math.PI, angle2);
    ctx17.strokeStyle = color;
    ctx17.stroke();

    ctx17.fillStyle = color;
    ctx17.font = width / 6 + "px Arial";
    ctx17.textAlign = 'center';
    ctx17.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx17.transform = "rotate(90deg)";
    ctx17.fillText(status, width / 2, height - 25);
    counter++;
    if (counter <= percent17) {
        setTimeout(draw, 20);
    }
}, 200);