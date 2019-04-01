
$('.drop').find('li').click(function () {
    var selectResult = $(this).html();
    $(this).parent().parent().find('input').val(selectResult);
    $('.slct').removeClass('active').html(selectResult);
    //$('.drop').css('transform', 'scaleY(0)');
});

$('.slct-2').click(function () {
    var dropBlock = $(this).parent().find('.drop-2');
    if (dropBlock.is(':hidden')) {
        dropBlock.slideDown();
        $(this).addClass('active');
        $('.drop-2').find('li').click(function () {
            var selectResult = $(this).html();
            $(this).parent().parent().find('input').val(selectResult);
            $('.slct-2').removeClass('active').html(selectResult);
            dropBlock.slideUp();
        });
    } else {
        $(this).removeClass('active');
        dropBlock.slideUp();
    }
    return false;
});

$(".my-nav li").click(function () {
    $(this).toggleClass('my-nav_open');
});

$('.live_cont-block').mouseenter(function () {
    $(this).addClass('new');
    myVar = setTimeout(function(){
        $('.live_cont-block').removeClass('new');
    }, 5000);
}).mouseleave(function () {
    $(this).removeClass('new');
    clearTimeout(myVar);
});

var textShowing = true;
$(".burger").click(function () {
    $('.menu').slideToggle();
});
$('.burger').click(function () {
    $('.burger').toggleClass('opened');
    $('.header').toggleClass('header-color');
    $('.top_nav').click(function () {
        $('.burger').removeClass('opened');
        $(".top_nav").css("display", "none");
    });
});


$(".login-btn").click(function () {
    $('.modal_sigh-up').slideDown();

});

$(".close_modal").click(function () {

    $('.modal_sigh-up').slideUp();
    $('.modal_sigh-in').slideUp();
});
$(".out, .log").click(function () {
    $('.modal_sigh-in').slideDown();

});
$('.country_list').find('li').click(function () {
    var selectResult = $(this).html();
    $(this).parent().parent().find('input').val(selectResult);
    $('.country').removeClass('active').html(selectResult);
    $('.country_cont').removeClass('start');
    $('.country_cont').addClass('activ_label');
    //$('.drop').css('transform', 'scaleY(0)');
});
$('.country').click(function () {
    var dropBlock = $(this).parent().find('.country_list');
    $('.country_cont').addClass('start');
    if (dropBlock.is(':hidden')) {
        dropBlock.slideDown();
        $(this).addClass('active');
        $('.country_list').find('li').click(function () {
            var selectResult = $(this).html();
            $(this).parent().parent().find('input').val(selectResult);
            $('.country').removeClass('active').html(selectResult);
            dropBlock.slideUp();
        });
    } else {
        $(this).removeClass('active');
        $('.country_cont').removeClass('start');
        dropBlock.slideUp();
    }
    return false;
});

$('.list').click(function () {
    $('.general-list').css('display', 'block');
    $('.general-grid').css('display', 'none');
    $(this).addClass('watchlist-cont_all_active');
    $('.grid').removeClass('watchlist-cont_all_active');

});
$('.grid').click(function () {
    $('.general-grid').css('display', 'block');
    $('.general-list').css('display', 'none');
    $(this).addClass('watchlist-cont_all_active');
    $('.list').removeClass('watchlist-cont_all_active');
});


$('.live_chat').click(function () {
    $('.live_abs').toggleClass('live_abs-active');
});
$('.chat_close').click(function () {
    $('.live_abs').removeClass('live_abs-active');
});