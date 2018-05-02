canvas  = document.getElementById("canvas");
var ctx   = canvas.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent = 9.5;
var percent2 = percent *10;
var counter = 0;

function baseCir(){
    ctx.beginPath();
    ctx.lineWidth = width/14;
    ctx.strokeStyle ="#e2e2e2";
    ctx.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx.stroke();
    ctx.closePath();
}
setTimeout(function draw(){

    var angle = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx.clearRect(0,0,width,height);
    baseCir();
    ctx.beginPath();
    ctx.lineWidth = width/14;
    ctx.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();



    ctx.fillStyle = color;
    ctx.font = width/6 + "px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.fillText( percent + "", width / 2, width / 2 );
    ctx.transform = "rotate(90deg)";
    ctx.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent2) {
        setTimeout(draw ,20);
    }
},200);

canvas3  = document.getElementById("canvas-3");
var ctx3   = canvas3.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas3.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_3 = 9.5;
var percent3 = percent_3 *10;
var counter = 0;


function baseCir3(){
    ctx3.beginPath();
    ctx3.lineWidth = width/14;
    ctx3.strokeStyle ="#e2e2e2";
    ctx3.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx3.stroke();
    ctx3.closePath();
}
setTimeout(function draw(){
    var angle = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx3.clearRect(0,0,width,height);
    baseCir3();
    ctx3.beginPath();
    ctx3.lineWidth = width/14;
    ctx3.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle);
    ctx3.strokeStyle = color;
    ctx3.stroke();
    ctx3.closePath();

    ctx3.fillStyle = color;
    ctx3.font = width/6 + "px Arial";
    ctx3.textAlign = 'center';
    ctx3.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx3.transform = "rotate(90deg)";
    ctx3.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent3) {
        setTimeout(draw ,20);
    }
},200);

canvas4  = document.getElementById("canvas-4");
var ctx4   = canvas4.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas4.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_4 = 9.0;
var percent4 = percent_4 *10;
var counter = 0;
var counter3 = 0;

function baseCir4(){
    ctx4.beginPath();
    ctx4.lineWidth = width/14;
    ctx4.strokeStyle ="#e2e2e2";
    ctx4.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx4.stroke();
    ctx4.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx4.clearRect(0,0,width,height);
    baseCir4();
    ctx4.beginPath();
    ctx4.lineWidth = width/14;
    ctx4.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx4.strokeStyle = color;
    ctx4.stroke();

    ctx4.fillStyle = color;
    ctx4.font = width/6 + "px Arial";
    ctx4.textAlign = 'center';
    ctx4.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx4.transform = "rotate(90deg)";
    ctx4.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent4) {
        setTimeout(draw ,20);
    }
},200);


canvas5  = document.getElementById("canvas-5");
var ctx5   = canvas5.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas4.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_5 = 9.0;
var percent5 = percent_5 *10;
var counter = 0;


function baseCir5(){
    ctx5.beginPath();
    ctx5.lineWidth = width/14;
    ctx5.strokeStyle ="#e2e2e2";
    ctx5.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx5.stroke();
    ctx5.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx5.clearRect(0,0,width,height);
    baseCir5();
    ctx5.beginPath();
    ctx5.lineWidth = width/14;
    ctx5.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx5.strokeStyle = color;
    ctx5.stroke();

    ctx5.fillStyle = color;
    ctx5.font = width/6 + "px Arial";
    ctx5.textAlign = 'center';
    ctx5.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx5.transform = "rotate(90deg)";
    ctx5.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent5) {
        setTimeout(draw ,20);
    }
},200);

canvas6  = document.getElementById("canvas-6");
var ctx6   = canvas6.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas6.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_6 = 9.2;
var percent6 = percent_6 *10;
var counter = 0;


function baseCir6(){
    ctx6.beginPath();
    ctx6.lineWidth = width/14;
    ctx6.strokeStyle ="#e2e2e2";
    ctx6.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx6.stroke();
    ctx6.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx6.clearRect(0,0,width,height);
    baseCir6();
    ctx6.beginPath();
    ctx6.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx6.strokeStyle = color;
    ctx6.stroke();

    ctx6.fillStyle = color;
    ctx6.font = width/6 + "px Arial";
    ctx6.textAlign = 'center';
    ctx6.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx6.transform = "rotate(90deg)";
    ctx6.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent6) {
        setTimeout(draw ,20);
    }
},200);
canvas7  = document.getElementById("canvas-7");
var ctx7   = canvas7.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas7.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_7 = 9.2;
var percent7 = percent_7 *10;
var counter = 0;


function baseCir7(){
    ctx7.beginPath();
    ctx7.lineWidth = width/14;
    ctx7.strokeStyle ="#e2e2e2";
    ctx7.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx7.stroke();
    ctx7.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx7.clearRect(0,0,width,height);
    baseCir7();
    ctx7.beginPath();
    ctx7.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx7.strokeStyle = color;
    ctx7.stroke();

    ctx7.fillStyle = color;
    ctx7.font = width/6 + "px Arial";
    ctx7.textAlign = 'center';
    ctx7.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx7.transform = "rotate(90deg)";
    ctx7.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent7) {
        setTimeout(draw ,20);
    }
},200);


canvas8  = document.getElementById("canvas-8");
var ctx8   = canvas8.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas8.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_8 = 8.9;
var percent8 = percent_8 *10;
var counter = 0;


function baseCir8(){
    ctx8.beginPath();
    ctx8.lineWidth = width/14;
    ctx8.strokeStyle ="#e2e2e2";
    ctx8.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx8.stroke();
    ctx8.closePath();
}
setTimeout(function draw(){
    var angle = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx8.clearRect(0,0,width,height);
    baseCir8();
    ctx8.beginPath();
    ctx8.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle);
    ctx8.strokeStyle = color;
    ctx8.stroke();

    ctx8.fillStyle = color;
    ctx8.font = width/6 + "px Arial";
    ctx8.textAlign = 'center';
    ctx8.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx8.transform = "rotate(90deg)";
    ctx8.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent8) {
        setTimeout(draw ,20);
    }
},200);
canvas9  = document.getElementById("canvas-9");
var ctx9   = canvas9.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas9.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_9 = 8.7;
var percent9 = percent_9 *10;
var counter = 0;


function baseCir9(){
    ctx9.beginPath();
    ctx9.lineWidth = width/14;
    ctx9.strokeStyle ="#e2e2e2";
    ctx9.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx9.stroke();
    ctx9.closePath();
}
setTimeout(function draw(){
    var angle = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx9.clearRect(0,0,width,height);
    baseCir9();
    ctx9.beginPath();
    ctx9.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle);
    ctx9.strokeStyle = color;
    ctx9.stroke();

    ctx9.fillStyle = color;
    ctx9.font = width/6 + "px Arial";
    ctx9.textAlign = 'center';
    ctx9.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx9.transform = "rotate(90deg)";
    ctx9.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent9) {
        setTimeout(draw ,20);
    }
},200);


canvas10  = document.getElementById("canvas-10");
var ctx10   = canvas10.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas10.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_10 = 8.6;
var percent10 = percent_10 *10;
var counter = 0;


function baseCir10(){
    ctx10.beginPath();
    ctx10.lineWidth = width/14;
    ctx10.strokeStyle ="#e2e2e2";
    ctx10.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx10.stroke();
    ctx10.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx10.clearRect(0,0,width,height);
    baseCir10();
    ctx10.beginPath();
    ctx10.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx10.strokeStyle = color;
    ctx10.stroke();

    ctx10.fillStyle = color;
    ctx10.font = width/6 + "px Arial";
    ctx10.textAlign = 'center';
    ctx10.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx10.transform = "rotate(90deg)";
    ctx10.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent10) {
        setTimeout(draw ,20);
    }
},200);


canvas11  = document.getElementById("canvas-11");
var ctx11   = canvas11.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas11.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_11 = 8.6;
var percent11 = percent_11 *10;
var counter = 0;


canvas12  = document.getElementById("canvas-12");
var ctx12   = canvas12.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas12.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_12 = 9.2;
var percent12 = percent_12 *10;
var counter = 0;

canvas13  = document.getElementById("canvas-13");
var ctx13   = canvas13.getContext('2d');
var color   = '#2af';
var width   = /*canvas.width*/ 100;
canvas13.height  = /*width*/  100;
var height = /*canvas.height*/ 100;
var percent_13 = 9.2;
var percent13 = percent_13 *10;
var counter = 0;

function baseCir11(){
    ctx11.beginPath();
    ctx11.lineWidth = width/14;
    ctx11.strokeStyle ="#e2e2e2";
    ctx11.arc(width/2 ,width/2, width/3, 0, Math.PI*2);
    ctx11.stroke();
    ctx11.closePath();
}
setTimeout(function draw(){
    var angle2 = Math.PI*1.5  + Math.PI *2* counter /100;
    ctx11.clearRect(0,0,width,height);
    baseCir11();
    ctx11.beginPath();
    ctx11.arc(width/2 ,width/2 ,width/3,1.5*Math.PI ,angle2);
    ctx11.strokeStyle = color;
    ctx11.stroke();

    ctx11.fillStyle = color;
    ctx11.font = width/6 + "px Arial";
    ctx11.textAlign = 'center';
    ctx11.textBaseline = 'middle';
    // ctx.fillText( percent3 + "", width / 2, width / 2 );
    ctx11.transform = "rotate(90deg)";
    ctx11.fillText(status ,width/2, height -25);
    counter++;
    if (counter <= percent11) {
        setTimeout(draw ,20);
    }
},200);










$('.burger').removeClass('opened');$('.header').removeClass('header-color');$('body, html').animate({scrollTop:top},1000);var textShowing=true;$(".burger").click(function(){$('.menu').slideToggle();});$('.burger').click(function(){$('.burger').toggleClass('opened');$('.header').toggleClass('header-color');$('.top_nav').click(function(){$('.burger').removeClass('opened');$(".top_nav").css("display","none");});});$(".dws-progress-bar").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',90,100);$(".dws-progres").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',89,100);$(".dws-progres_9").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',85,100);$(".dws-progres_8-9").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',83,100);$(".dws-progres_8-6").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',80,100);$(".dws-progress-bar_1").circularProgress({color:"#12a6f9",line_width:6,height:"100px",width:"100px",percent:0,starting_position:75}).circularProgress('animate',80,100);$('.slct').click(function(){var dropBlock=$(this).parent().find('.drop');if(dropBlock.is(':hidden')){dropBlock.slideDown();$(this).addClass('active');$('.drop').find('li').click(function(){var selectResult=$(this).html();$(this).parent().parent().find('input').val(selectResult);$('.slct').removeClass('active').html(selectResult);dropBlock.slideUp();});}else{$(this).removeClass('active');dropBlock.slideUp();}return false;});$('.slct-2').click(function(){var dropBlock=$(this).parent().find('.drop-2');if(dropBlock.is(':hidden')){dropBlock.slideDown();$(this).addClass('active');$('.drop-2').find('li').click(function(){var selectResult=$(this).html();$(this).parent().parent().find('input').val(selectResult);$('.slct-2').removeClass('active').html(selectResult);dropBlock.slideUp();});}else{$(this).removeClass('active');dropBlock.slideUp();}return false;});