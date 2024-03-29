(function ($) {
    var global_settings = {};
    var methods = {
        init: function (options) {
            var settings = $.extend({
                color: "#000000",
                height: "300px",
                width: "300px",
                line_width: 8,
                starting_position: 25,
                percent: 100,
                counter_clockwise: false,
                percentage: true,
                text: ''
            }, options);
            global_settings = settings;
            var percentage = $("<div class='progress-percentage'></div>");
            if (!global_settings.percentage) {
                percentage.text(global_settings.percentage);
            }
            $(this).append(percentage);
            var text = $("<div class='progress-text'></div>");
            if (global_settings.text != "percent") {
                text.text(global_settings.text);
            }
            $(this).append(text);
            if (global_settings.starting_position != 100) {
                global_settings.starting_position = global_settings.starting_position % 100;
            }
            if (global_settings.ending_position != 100) {
                global_settings.ending_position = global_settings.ending_position % 100;
            }
            appendUnit(global_settings.width);
            appendUnit(global_settings.height);
            $(this).css({"height": global_settings.height, "width": global_settings.width});
            $(this).addClass("circular-progress-bar");
            $(this).find("canvas").remove();
            $(this).append(createCanvas($(this)));
            return this;
        }, percent: function (value) {
            global_settings.percent = value;
            $(this).css({"height": global_settings.height, "width": global_settings.width});
            $(this).children("canvas").remove();
            $(this).append(createCanvas($(this)));
            return this;
        }, animate: function (value, time) {
            $(this).css({"height": global_settings.height, "width": global_settings.width});
            var num_of_steps = time / 10;
            var percent_change = (value - global_settings.percent) / num_of_steps;
            var scope = $(this);
            var theInterval = setInterval(function () {
                if (global_settings.percent < value) {
                    scope.children("canvas").remove();
                    global_settings.percent += percent_change;
                    scope.append(createCanvas(scope));
                } else {
                    clearInterval(theInterval);
                }
            }, 10);
            return this;
        }
    };
    $.fn.circularProgress = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist.');
        }
    };

    function removeUnit(apples) {
        if (apples.indexOf("px")) {
            return apples.substring(0, apples.length - 2);
        } else if (canvas_height.indexOf("%")) {
            return apples.substring(0, apples.length - 1);
        }
    };

    function appendUnit(apples) {
        if (apples.toString().indexOf("px") < -1 && apples.toString().indexOf("%") < -1) {
            return apples += "px";
        }
    };

    function calcPos(apples, percent) {
        if (percent < 0) {
            var starting_degree = (parseInt(apples) / 100) * 360;
            var starting_radian = starting_degree * (Math.PI / 180);
            return starting_radian - (Math.PI / 2);
        } else {
            var ending_degree = ((parseInt(apples) + parseInt(percent)) / 100) * 360;
            var ending_radian = ending_degree * (Math.PI / 180);
            return ending_radian - (Math.PI / 2);
        }
    };

    function insertText(scope) {
        $(".progress-percentage").text(Math.round(global_settings.percent) + "%");
    }

    function createCanvas(scope) {
        var canvas_height = removeUnit(global_settings.height.toString());
        var canvas_width = removeUnit(global_settings.width.toString());
        var canvas = document.createElement("canvas");
        canvas.height = canvas_height;
        canvas.width = canvas_width;
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = global_settings.color;
        ctx.lineWidth = global_settings.line_width;
        ctx.beginPath();
        var starting_radian = calcPos(global_settings.starting_position, -1);
        var ending_radian = calcPos(global_settings.starting_position, global_settings.percent);
        var radius = 0;
        var xcoord = canvas_width / 2;
        var ycoord = canvas_height / 2;
        if (canvas_height >= canvas_width) {
            radius = canvas_width * 0.9 / 2 - (global_settings.line_width * 2);
        } else {
            radius = canvas_height * 0.9 / 2 - (global_settings.line_width * 2);
        }
        ctx.arc(xcoord, ycoord, radius, starting_radian, ending_radian, global_settings.counter_clockwise);
        ctx.stroke();
        if (global_settings.percentage) {
            insertText(scope);
        }
        return canvas;
    };
}(jQuery));