
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

if ($('.ms-block').css('display') == 'none') {
    $('.my-nav li').mouseenter(function () {
        $(this).addClass('main')
    }).mouseleave(function () {
        $(this).removeClass('main')
    });
} else {
    $('.my-nav li').on('click', function () {
        $(this).toggleClass('main');
    });
}

$('.live_cont-block').mouseenter(function () {
    $(this).addClass('new');
    myVar = setTimeout(function(){
        $('.live_cont-block').removeClass('new');
    }, 1000);
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



// real code
// $(".login-btn").click(function () {
//     $('.modal_sigh-up').slideDown();
// });
//
// $(".close_modal").click(function () {
//     $('.modal_sigh-up').slideUp();
//     $('.modal_sigh-in').slideUp();
// });
//
// $(".out, .log").click(function () {
//     $('.modal_sigh-in').slideDown();
//
// });
//
// $(".v-btn").click(function () { $('.v-modal').slideDown(); });
///////

//test
// $(".login-btn").click(function () {
//     $('.modal_sigh-up').slideDown();
// });

$(".close_modal").click(function () {
    $('.modal_sigh-up').slideUp();
    $('.modal_sigh-in').slideUp();
});

// $(".out, .log").click(function () {
//     $('.modal_sigh-in').slideDown();
// });

// $(".my-log-out").click(function () {
//     $('.modal_sigh-in').slideDown();
// });

// $(".my-log-in").click(function () {
//     $('.modal_sigh-in').slideDown();
// });
// $(".my-log-up").click(function () {
//     $('.modal_sigh-up').slideDown();
// });

$(".form_cliking_decoration").click(function () {
    $('.modal_sigh-up').slideDown();
});

$(".form_cliking_decoration_popup").click(function () {
    $('.modal_sigh-up').slideUp();
});

// login button, get the sign in
$(".v-btn").click(function () { $('.v-modal').slideDown(); });




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

// $('.list').click(function () {
//     $('.general-list').css('display', 'block');
//     $('.general-grid').css('display', 'none');
//     $(this).addClass('watchlist-cont_all_active');
//     $('.grid').removeClass('watchlist-cont_all_active');
//
// });
// $('.grid').click(function () {
//     $('.general-grid').css('display', 'block');
//     $('.general-list').css('display', 'none');
//     $(this).addClass('watchlist-cont_all_active');
//     $('.list').removeClass('watchlist-cont_all_active');
// });


$('.all').click(function () {

    if ( $('#grid').hasClass('watchlist-cont_all_active'))
    {
        $('.general-grid').css('display', 'block');
        $('.general-list').css('display', 'none');

        $('.grid').addClass('watchlist-cont_all_active');
        $('.list').removeClass('watchlist-cont_all_active');
    }
    else{
        $('.general-grid').css('display', 'none');
        $('.general-list').css('display', 'block');

        $('.list').addClass('watchlist-cont_all_active');
        $('.grid').removeClass('watchlist-cont_all_active');
    }

    $('.watch-general-list').css('display', 'none');
    $('.watch-general-grid').css('display', 'none');

    $(this).addClass('watchlist-cont_all_active');
    $('.watchlist').removeClass('watchlist-cont_all_active');

});

$('.watchlist').click(function () {

    if ( $('#grid').hasClass('watchlist-cont_all_active'))
    {
        $('.watch-general-grid').css('display', 'block');
        $('.watch-general-list').css('display', 'none');

        $('.grid').addClass('watchlist-cont_all_active');
        $('.list').removeClass('watchlist-cont_all_active');
    }
    else{
        $('.watch-general-list').css('display', 'block');
        $('.watch-general-grid').css('display', 'none');

        $('.list').addClass('watchlist-cont_all_active');
        $('.grid').removeClass('watchlist-cont_all_active');
    }

    $('.general-grid').css('display', 'none');
    $('.general-list').css('display', 'none');

    $(this).addClass('watchlist-cont_all_active');
    $('.all').removeClass('watchlist-cont_all_active');

});

$('.list').click(function () {
    if ($( "#watchlist" ).hasClass( "watchlist-cont_all_active" )) {
        $('.watch-general-list').css('display', 'block');
        $('.watch-general-grid').css('display', 'none');
        $('.general-grid').css('display', 'none');
        $('.general-list').css('display', 'none');
    }
    else{
        $('.general-list').css('display', 'block');
        $('.general-grid').css('display', 'none');
        $('.watch-general-list').css('display', 'none');
        $('.watch-general-grid').css('display', 'none');
    }

    $(this).addClass('watchlist-cont_all_active');
    $('.grid').removeClass('watchlist-cont_all_active');

});

$('.grid').click(function () {
    if ($( "#watchlist" ).hasClass( "watchlist-cont_all_active" )) {
        $('.watch-general-grid').css('display', 'block');
        $('.watch-general-list').css('display', 'none');
        $('.general-grid').css('display', 'none');
        $('.general-list').css('display', 'none');
    }
    else {
        $('.general-grid').css('display', 'block');
        $('.general-list').css('display', 'none');
        $('.watch-general-list').css('display', 'none');
        $('.watch-general-grid').css('display', 'none');
    }
    $(this).addClass('watchlist-cont_all_active');
    $('.list').removeClass('watchlist-cont_all_active');

});
