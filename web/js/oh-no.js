$('.grid_absolut_close').click(function () {
    $(this).parent().slideUp(1);
    $(this).parent().parent().removeClass('grid_absolut_visible');
    $(this).parent().parent().removeClass('list_absolut_visible');
    console.log("1")
    return false
});
$('.input_absolut .grid_absolut_close').click(function () {
   $(this).parent().parent().removeClass('input_absolut_after');
    console.log("2")
    return false
});
$('.list').click(function () {
    $(this).parent().addClass('grid_absolut_visible');
    $(this).parent().removeClass('list_absolut_visible');
    console.log("3")
    return false
});
$('.grid').click(function () {
    $(this).parent().removeClass('grid_absolut_visible');
    $(this).parent().addClass('list_absolut_visible');
    console.log("4")
    return false
});

$('.what').click(function () {

    console.log("what")
    return false
});