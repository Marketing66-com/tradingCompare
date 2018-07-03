$('.grid_absolut_close').click(function () {
    $(this).parent().slideUp(1);
    $(this).parent().parent().removeClass('grid_absolut_visible');
    $(this).parent().parent().removeClass('list_absolut_visible');
});
$('.input_absolut .grid_absolut_close').click(function () {
    $(this).parent().parent().removeClass('input_absolut_after');
});
$('.list').click(function () {
    $(this).parent().addClass('grid_absolut_visible');
    $(this).parent().removeClass('list_absolut_visible');
});
$('.grid').click(function () {
    $(this).parent().removeClass('grid_absolut_visible');
    $(this).parent().addClass('list_absolut_visible');
});