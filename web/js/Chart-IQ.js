
<style>
.stx-marker.abstract {
    width: 0;
    transition: all .2s;
}

.stx-marker-content .sample {
    position: absolute;
    bottom: 0;
    margin-left: -67px;
    width: 135px;
    height: 135px;
    background: rgba(255, 255, 255, .1);
    text-align: left;
    border-radius: 50%;
    -webkit-transition: width 0.2s 0s, height 0.2s 0s, border-radius 0.2s 0s, margin 0.2s 0s, background 0.5s;
    transition: width 0.2s 0s, height 0.2s 0s, border-radius 0.2s 0s, margin 0.2s 0s, background 0.5s;
}

.sample:hover {
    width: 250px;
    margin-left: -125px;
    border-radius: 5px;
    background: #fff;
    -webkit-transition: width 0.2s .5s, height 0.2s .5s, border-radius 0.2s .5s, margin 0.2s .5s, background 1s;
    transition: width 0.2s .5s, height 0.2s .5s, border-radius 0.2s .5s, margin 0.2s .5s, background 1s;
}

.sample .text {
    position: absolute;
    font-size: 11px;
    left: 160px;
    width: 80px;
    bottom: 13px;
    opacity: 0;
    line-height: 13px;
    -webkit-transition: opacity 0s 0s;
    -moz-transition: opacity 0s 0s;
    transition: opacity 0s 0s;
}

.sample:hover .text {
    opacity: 1;
    -webkit-transition: opacity 0.4s .7s;
    -moz-transition: opacity 0.4s .7s;
    transition: opacity 0.4s .7s;
}

        #stage {
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 115px;
    height: 115px;
    background: #e8e8e8;
    border-radius: 50%;
    -webkit-transition: width 0.2s 0s, height 0.2s 0s, border-radius 0.2s 0s, margin 0.2s 0s, background 0.2s;
    transition: width 0.2s 0s, height 0.2s 0s, border-radius 0.2s 0s, margin 0.2s 0s, background 0.2s;
}

.sample:hover #stage {
    width: 135px;
    border-radius: 5px;
    background: #e8e8e8;
    -webkit-transition: width 0.2s .5s, height 0.2s .5s, border-radius 0.2s .5s, margin 0.2s .5s, background 0.2s;
    transition: width 0.2s .5s, height 0.2s .5s, border-radius 0.2s .5s, margin 0.2s .5s, background 0.2s;
}

        @-webkit-keyframes heli-hover {
    0% {
    -webkit-transform: rotate(0deg) translateY(0px);
}
    35% {
    -webkit-transform: rotate(6deg) translateY(-70px);
}
    80% {
    -webkit-transform: rotate(-4deg) translateY(0px);
}
    100% {
    -webkit-transform: translateY(0px);
}
}

        @keyframes heli-hover {
    0% {
        transform: rotate(0deg) translateY(0px);
}
    35% {
        transform: rotate(6deg) translateY(-70px);
}
    80% {
        transform: rotate(-4deg) translateY(0px);
}
    100% {
        transform: translateY(0px);
}
}

        #helicopter {
    position: absolute;
    margin-left: -5px;
    margin-bottom: 5px;
    left: -10px;
    bottom: 15px;
    width: 145px;
    height: 55px;
    -webkit-transition: margin 0.75s;
    transition: margin 0.75s;
}
.ciq-night cq-attrib-container
{
    visibility:hidden;
}
.sample:hover #helicopter {
    margin-left: 0px;
    margin-bottom: 0;
    -webkit-animation: heli-hover 6s ease-in-out infinite;
    /* Chrome, Safari, Opera */
    animation: heli-hover 6s ease-in-out infinite;
    /* Standard syntax */
}

        #propeller {
    position: absolute;
    top: 2px;
    left: 30px;
    width: 0px;
    perspective: 500px;
    -webkit-perspective: 500px;
    z-index: 1;
}

        @keyframes spinner {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(-360deg);
    }
}

        @-webkit-keyframes spinner {
    from {
        -webkit-transform: rotateY(0deg);
    }
    to {
        -webkit-transform: rotateY(-360deg);
    }
}

        #spinner {
    -webkit-animation: spinner 1s linear infinite;
    /* Chrome, Safari, Opera */
    animation: spinner 1s linear infinite;
    /* Standard syntax */
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
}

        #spinner div {
    position: absolute;
    background: #999;
    width: 80px;
    height: 4px;
}

        #heli-body {
    position: absolute;
    left: 0;
    width: 145px;
    height: 55px;
    position: absolute;
    background: url(css/img/helicopter.png) no-repeat center;
    z-index: 2;
}
.price_up {
    background-color: #b0e4ad;

}
.price_down {
    background-color: #f9c2c2;

}
</style>


<style>
.negative{color:red;}
.positive{color:#9CD400;}
.neutral{color:#000000;}
        #selectObjectId{border-style: solid;border-width:1px;border-color:#e2b000;height:40px;font-family: roboto;color: white;}
::placeholder {color: white;}
        #tags{font-family: roboto;border-color:#e2b000;height:40px;font-weight: 300;background: #1C2A35;color: white;height: 37px;border: 1px solid black;font-size:18px;margin-left:1.5%;}
.ui-autocomplete {font-family: roboto;max-height: 300px;overflow-y: auto;overflow-x: hidden;padding-right: 20px}
        #selectExchange{background: #1C2A35;color: white;height: 42px;width:100%;border: 1px solid black;font-family: roboto;font-size:20px;font-weight: 300;margin-left:1%;}
.buy_button {font-family :roboto;background-color: #007f02  ;font-weight:400;font-size:20px;text-align:center;color:#ffffff;height:47px;width:5%;border: 2px solid #007f02 ;border-radius: 7px;margin-left:44%;margin-top:0.5%;}
.sell_button {font-family :roboto;background-color: #d20000 ;font-weight:400;font-size:20px;text-align:center;color:#ffffff;border:none;height:47px;width:120px;border: 2px solid #d20000 ;border-radius: 7px;margin-left:1%;}
.ciq-night cq-attrib-container {visibility:hidden;}
.price_up {background-color: #b0e4ad;}
.price_down {background-color: #f9c2c2;}
.up{color: green;}
.down {color: red;}
.trade_button {font-family: roboto;font-size:16px;font-weight: 200;text-align: left;color:white;color: blue;height: 40px;width: 40px;}
cq-chart-title cq-chart-price {font-size:20px ;width : 150px;}
cq-current-price{margin-left:0;width: 50px;}
cq-lookup-icon {position:absolute;height:27px;width: 27px;right:15px;top:-9px;background-image:url('{{asset("img/stx-sprite-ui.svg")}}');background-position: -45px -25px;opacity: .6;left: 90%;transition: opacity .20s 0s;}
cq-chart-title cq-chart-price {display:inline-block;line-height:20px;font-size:20px;margin-left:5px;font-weight:500;vertical-align:text-bottom;}
cq-chart-title cq-symbol {font-size:40px;}
/*cq-context {position: absolute;height: 650px; width:100%;}*/
/*.general_chart2{padding-right: 0px; padding-left: 0px; padding-bottom: 0px;padding-bottom: 0px;}*/
cq-context {height: 650px; }
</style>
// Placeholder breakpoint classes

/**
 * Check the current width of the window and assign the appropriate css class
 * that will provide a better look and feel for your screen size.
 * Choices are small (break-sm), medium (break-md), large (break-lg)
 */

function clickme()
{
    clickme2()
}
(function($) {
    function checkWidth() {
        if ($(window).width() > 700) {
            $('body').removeClass('break-md break-sm').addClass('break-lg');
            $('.icon-toggles').removeClass('sidenav active').addClass('ciq-toggles');
            stxx.layout.sidenav = 'sidenavOff';
            $('#symbol').attr("placeholder", "Enter Symbol");
            return;
        }
        if ($(window).width() <= 700 && $(window).width() > 584) {
            $('body').removeClass('break-lg break-sm').addClass('break-md');
            $('.icon-toggles').removeClass('sidenav active').addClass('ciq-toggles');
            stxx.layout.sidenav = 'sidenavOff';
            $('#symbol').attr("placeholder", "Symbol");
            return;
        }
        if ($(window).width() <= 584) {
            $('body').removeClass('break-md break-lg').addClass('break-sm');
            $('.icon-toggles').removeClass('ciq-toggles').addClass('sidenav');
            $('#symbol').attr("placeholder", "");
        }
    }

    function setHeight() {
        var windowHeight=$(window).height();
        var ciqHeight = $('.ciq-chart').height();

        if ($('body').hasClass("toolbar-on")) {
            $('#chartContainer').height(ciqHeight - 45);
        } else {
            $('#chartContainer').height(ciqHeight);
        }
        // This little snippet will ensure that dialog boxes are never larger than the screen height
        $('#maxHeightCSS').remove();
        $('head').append('<style id="maxHeightCSS">cq-dialog { max-height: ' +  windowHeight + 'px }</style>');
    }


    $(".stx-markers cq-item.circle").stxtap(function(){
        $(".stx-markers .ciq-radio").removeClass("ciq-active");
        $(".stx-markers cq-item.circle .ciq-radio").addClass("ciq-active");
        showMarkers("circle");
    });
    $(".stx-markers cq-item.square").stxtap(function(){
        $(".stx-markers .ciq-radio").removeClass("ciq-active");
        $(".stx-markers cq-item.square .ciq-radio").addClass("ciq-active");
        showMarkers("square");
    });
    $(".stx-markers cq-item.callout").stxtap(function(){
        $(".stx-markers .ciq-radio").removeClass("ciq-active");
        $(".stx-markers cq-item.callout .ciq-radio").addClass("ciq-active");
        showMarkers("callout");
    });
    $(".stx-markers cq-item.abstract").stxtap(function(){
        $(".stx-markers .ciq-radio").removeClass("ciq-active");
        $(".stx-markers cq-item.abstract .ciq-radio").addClass("ciq-active");
        hideMarkers();
        var helicopter=$(".stx-marker.abstract").clone();
        helicopter.css({"z-index":"30","left":(0.4*stxx.chart.width).toString()+"px"});
        var marker=new CIQ.Marker({
            stx: stxx,
            xPositioner:"none",
            yPositioner:"above_candle",
            label: "helicopter",
            permanent: true,
            chartContainer: true,
            node: helicopter[0]
        });
        stxx.draw(); // call draw() when you're done adding markers. They will be positioned in batch.
    });

    $(".stx-markers cq-item.none").stxtap(function(){
        $(".stx-markers .ciq-radio").removeClass("ciq-active");
        $(".stx-markers cq-item.none .ciq-radio").addClass("ciq-active");
        hideMarkers();
    });
    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        // console.log("1adress", theUrl);
        return xmlHttp.responseText;
    }

    var socket = io.connect('https://streamer.cryptocompare.com/');
    var stxx=new CIQ.ChartEngine({container:$("#chartContainer")[0],layout:{"interval":60} ,preferences:{labels:false, currentPriceLine:true, whitespace:50}});
    stxx.layout.crosshair=true;
// Attach an automated quote feed to the chart to handle initial load, pagination and updates at preset intervals.
    stxx.attachQuoteFeed(quotefeedSimulator,{refreshInterval:1,bufferSize:200});

    function clickme2()
    {
        stxx.newChart(XRP/USD/Bitstamp);
    }


    function setExchange() {
        //EXCHANGE

        var arr = httpGet('https://afternoon-mountain-15657.herokuapp.com/Exchanges/' + stxx.chart.symbol)
        var Exchange_list = JSON.parse(arr)
        Exchange = Exchange_list[0]

        if(Exchange_list.length != 0)
            jQuery('#selectExchange').css("display", "");

        var selectExchange = document.getElementById("selectExchange");


        jQuery('#selectExchange').empty()

        for (var i = 0; i < Exchange_list.length; i++) {
            console.log(stxx.chart.symbol,Exchange_list[i])
            var option = document.createElement("option");
            option.value = Exchange_list[i]
            option.text = Exchange_list[i]
            selectExchange.appendChild(option);
        }
        // jQuery('#selectExchange').val(Exchange)
        // console.log("//////////////",jQuery( "#selectExchange option:selected" ).text())
        fill_price()

        jQuery('#selectExchange').on('change', function (e) {
            console.log("innnnnnnnnnnnnnnnnn",stxx.chart.symbol)
            var ExchangeSelected = jQuery("option:selected", this);
            Exchange = this.value

            var from = stxx.chart.symbol.split("/")[0]
            var name = get_name(from)

            var old_curr = stxx.chart.symbol
            var Exchange = jQuery( "#selectExchange option:selected" ).text()
            if(Exchange.length == 0)
            {
                var channel = "5~CCCAGG"
            }
            else
            {
                var channel = "2~" + Exchange
            }

            var my_channel = channel +"~" + old_curr.split("/")[0] + "~" + old_curr.split("/")[1]
            subscription = [my_channel]
            console.log("--------------",subscription)
            socket.emit('SubRemove', { subs: subscription });

            //   UIContext.UISymbolLookup.selectItem({symbol: stxx.chart.symbol, name: "Bitcoin", exchDisp: Exchange})
            var symb = {symbol: stxx.chart.symbol, name: name, exchDisp: Exchange}
            stxx.newChart(symb, null, null, function(err){
                if(err){
                    //TODO, symbol not found error
                    if(self.loader) self.loader.hide();
                    return;

                }

                setWS()
            })
        });


    }

    function fillExchange() {
        //EXCHANGE


        var arr = httpGet('https://afternoon-mountain-15657.herokuapp.com/Exchanges/' + stxx.chart.symbol)
        var Exchange_list = JSON.parse(arr)
        Exchange = Exchange_list[0]



        var selectExchange = document.getElementById("selectExchange");


        jQuery('#selectExchange').empty()

        for (var i = 0; i < Exchange_list.length; i++) {
            console.log(stxx.chart.symbol,Exchange_list[i])
            var option = document.createElement("option");
            option.value = Exchange_list[i]
            option.text = Exchange_list[i]
            selectExchange.appendChild(option);
        }



    }
// Optionally set a market factory to the chart to make it market hours aware. Otherwise it will operate in 24x7 mode.
// This is required for the simulator, or if you intend to also enable Extended hours trading zones.
//stxx.setMarketFactory(CIQ.Market.Symbology.factory);

// Extended hours trading zones -- Make sure this is instantiated before calling startUI as a timing issue with may occur
    new CIQ.ExtendedHours({stx:stxx, filter:true});

// Floating tooltip on mousehover
// comment in the following line if you want a tooltip to display when the crosshair toggle is turned on
// This should be used as an *alternative* to the HeadsUP (HUD).
    new CIQ.Tooltip({stx:stxx, ohl:true, volume:true, series:true, studies:true});

// Inactivity timer
    new CIQ.InactivityTimer({stx:stxx, minutes:30});

// Animation (using tension requires splines.js)
//new CIQ.Animation(stxx, {tension:0.3});

//TODO, encapsulate these in a helper object
    function restoreLayout(stx, cb){
        // var datum=CIQ.localStorage.getItem("myChartLayout");
        // if(datum===null) return;
        // function closure(){
        // 	restoreDrawings(stx, stx.chart.symbol);
        // 	if(cb) cb();
        // }
        // stx.importLayout(JSON.parse(datum), {managePeriodicity:true, cb: closure});
    }

    function saveLayout(obj){
        // var s=JSON.stringify(obj.stx.exportLayout(true));
        // CIQ.localStorageSetItem("myChartLayout", s);
    }

    function restoreDrawings(stx, symbol){
        var memory=CIQ.localStorage.getItem(symbol);
        if(memory!==null){
            var parsed=JSON.parse(memory);
            if(parsed){
                stx.importDrawings(parsed);
                stx.draw();
            }
        }
    }

    function saveDrawings(obj){
        var tmp=obj.stx.exportDrawings();
        if(tmp.length===0){
            CIQ.localStorage.removeItem(obj.symbol);
        }else{
            CIQ.localStorageSetItem(obj.symbol, JSON.stringify(tmp));
        }
    }

    function restorePreferences(){
        var pref=CIQ.localStorage.getItem("myChartPreferences");
        if (pref) stxx.importPreferences(JSON.parse(pref));
    }

    function savePreferences(obj){
        CIQ.localStorageSetItem("myChartPreferences",JSON.stringify(stxx.exportPreferences()));
    }

    function retoggleEvents(obj){
        var active=$(".stx-markers .ciq-radio.ciq-active");
        active.parent().triggerHandler("stxtap");
    }

//****************comment out if do not want to remember data
// stxx.callbacks.layout=saveLayout;
// stxx.callbacks.symbolChange=saveLayout;
    stxx.callbacks.drawing=saveDrawings;
    stxx.callbacks.newChart=retoggleEvents;
    stxx.callbacks.preferences=savePreferences;

    var UIContext;

    function startUI(){
        UIContext=new CIQ.UI.Context(stxx, $("cq-context,[cq-context]"));
        var UILayout=new CIQ.UI.Layout(UIContext);
        var UIHeadsUpDynamic=new CIQ.UI.HeadsUp($("cq-hu-dynamic"), UIContext, {followMouse:true, autoStart: false});
        var UIHeadsUpStatic=new CIQ.UI.HeadsUp($("cq-hu-static"), UIContext, {autoStart: true});

        fill_select_curr()
        UIContext.changeSymbol=function(data){

            var stx=this.stx;
            if(this.loader) this.loader.show();
            data.symbol=data.symbol.toUpperCase(); // set a pretty display version

            if(stxx.chart.symbol != null)
            {

            }
            // reset comparisons - remove this loop to transfer from symbol to symbol.
            for(var field in stx.chart.series) {
                // keep studies
                if (stxx.chart.series[field].parameters.bucket != "study" ) stx.removeSeries(field);
            }

            var self=this;
            stx.newChart(data, null, null, function(err){
                if(err){
                    //TODO, symbol not found error
                    if(self.loader) self.loader.hide();
                    return;

                }
                // The user has changed the symbol, populate $("cq-chart-title")[0].previousClose with yesterday's closing price

                if(stx.tfc) stx.tfc.changeSymbol();   // Update trade from chart
                if(self.loader) self.loader.hide();
                restoreDrawings(stx, stx.chart.symbol);
                console.log("++++++++++++++++++++++++++",old_curr,data.symbol)
                if(old_curr != data.symbol && stxx.chart.symbol!= null)
                {fillExchange()}// load an initial symbol
                //setWS()

            });
            console.log("OUTTTTT",data.symbol)
            //fillExchange()
        };


        UIContext.setLookupDriver(new CIQ.UI.Lookup.Driver.ChartIQ());

        UIContext.UISymbolLookup=$(".ciq-search cq-lookup")[0];



        var KeystrokeHub=new CIQ.UI.KeystrokeHub($("body"), UIContext, {cb:CIQ.UI.KeystrokeHub.defaultHotKeys});

        var UIStudyEdit=new CIQ.UI.StudyEdit(null, UIContext);

        var UIStorage=new CIQ.NameValueStore();

        var UIThemes=$("cq-themes");
        UIThemes[0].initialize({
            builtInThemes: {"ciq-day":"Day","ciq-night":"Night"},
            defaultTheme: "ciq-night",
            nameValueStore: UIStorage
        });

        var sidePanel=$("cq-side-panel")[0];
        if(sidePanel) sidePanel.registerCallback(resizeScreen);

        $(".ciq-sidenav")[0].registerCallback(function (value) {
            var stx=this.context.stx, rightPx;
            var sidePanelWidth = sidePanel?sidePanel.nonAnimatedWidth():0;
            if (value === 'sidenavOn') {
                var chartHolderHeight = $('.stx-holder').height();
                $('.sidenav').height(chartHolderHeight);
                this.node.addClass("active");
                stx.layout.sidenav = "sidenavOn";
                $('.sidenav').addClass("active");
                rightPx=this.node.width()+sidePanelWidth;
            } else if (value === 'sidenavOff') {
                rightPx=sidePanelWidth;
                $('.sidenav').removeClass("active");
                this.node.removeClass("active");
                stx.layout.sidenav = "sidenavOff";
            }
            $("cq-side-panel").css("right", rightPx - sidePanelWidth +"px");
            $('.ciq-chart-area').css({'right': rightPx +'px'});
            $('cq-tradingcentral').css({'margin-right': rightPx + 15 + 'px'});
            if(stx.slider) stx.slider.display(stx.layout.rangeSlider);
        });

        $(".ciq-HU")[0].registerCallback(function(value){
            if(value==="static"){
                UIHeadsUpDynamic.end();
                UIHeadsUpStatic.begin();
                this.node.addClass("active");
            }else if(value==="dynamic"){
                if(CIQ.isMobile){
                    // The dynamic headsUp doesn't make any sense on mobile devices so we skip that toggle
                    // by manually setting the toggle to "static"
                    this.set("static");
                    UIHeadsUpDynamic.end();
                    UIHeadsUpStatic.begin();
                    this.node.addClass("active");
                }else{
                    UIHeadsUpStatic.end();
                    UIHeadsUpDynamic.begin();
                    this.node.addClass("active");
                }
            }else{
                UIHeadsUpStatic.end();
                UIHeadsUpDynamic.end();
                this.node.removeClass("active");
            }
        });
        $(".ciq-draw")[0].registerCallback(function(value){
            if(value){
                this.node.addClass("active");
                $("body").addClass("toolbar-on");
            }else{
                this.node.removeClass("active");
                $("body").removeClass("toolbar-on");
            }
            setHeight();
            var stx=this.context.stx;
            stx.resizeChart();

            // a little code here to remember what the previous drawing tool was
            // and to re-enable it when the toolbar is reopened
            if(value){
                stx.changeVectorType(this.priorVectorType);
            }else{
                this.priorVectorType=stx.currentVectorParameters.vectorType;
                stx.changeVectorType("");
            }
        });

        if( $('.stx-trade')[0] ) {
            $('.stx-trade')[0].registerCallback(function(value) {
                var sidePanel=$("cq-side-panel")[0];
                if(value){
                    sidePanel.open({selector:".stx-trade-panel",className:"active"});
                    this.node.addClass("active");
                    $(".stx-trade-panel").removeClass("closed");
                    stxx.layout.sidenav = 'sidenavOff'; // in break-sm hide sidenav when turning on tfc side panel
                }else{
                    sidePanel.close();
                    this.node.removeClass("active");
                    $(".stx-trade-panel").addClass("closed");
                }
            });
        }

        if( $('.stx-tradingcentral')[0] ) {
            $('.stx-tradingcentral')[0].registerCallback(function(value) {
                var tcElement = $('cq-tradingcentral')[0];
                if (value) {
                    tcElement.removeAttribute('disabled');
                } else {
                    tcElement.setAttribute('disabled', 'disabled');
                }
            });
        }

        $("cq-redo")[0].pairUp($("cq-undo"));

        var params={
            excludedStudies: {
                "Directional": true,
                "Gopala":true,
                "vchart":true
            },
            alwaysDisplayDialog: {"ma":true},
            /*dialogBeforeAddingStudy: {"rsi": true} // here's how to always show a dialog before adding the study*/
        };
        var UIStudyMenu=new CIQ.UI.StudyMenu($("*[cq-studies]"), UIContext, params);
        UIStudyMenu.renderMenu();

        $("cq-views").each(function(){
            this.initialize();
        });

        if(UIContext.loader) UIContext.loader.show();
        restorePreferences();
        restoreLayout(stxx, function(){
            if(UIContext.loader) UIContext.loader.hide();
        });

        //INITIAL SYMBOL
        if(!stxx.chart.symbol){
            initialSymbol()



        }

        CIQ.UI.begin();

        //CIQ.I18N.setLanguage(stxx, "zh");	// Optionally set a language for the UI, after it has been initialized, and translate.
    }

    function hideMarkers(){
        CIQ.Marker.removeByLabel(stxx, "circle");
        CIQ.Marker.removeByLabel(stxx, "square");
        CIQ.Marker.removeByLabel(stxx, "callout");
        CIQ.Marker.removeByLabel(stxx, "helicopter");
    }

    function showMarkers(standardType){
        // Remove any existing markers
        hideMarkers();
        var l=stxx.masterData.length;
        // An example of a data array to drive the marker creation
        var data=[
            {x:stxx.masterData[l-5].DT, type:standardType, category:"news", headline:"This is a Marker for a News Item"},
            {x:stxx.masterData[l-15].DT, type:standardType, category:"earningsUp", headline:"This is a Marker for Earnings (+)"},
            {x:stxx.masterData[l-25].DT, type:standardType, category:"earningsDown", headline:"This is a Marker for Earnings (-)"},
            {x:stxx.masterData[l-35].DT, type:standardType, category:"dividend", headline:"This is a Marker for Dividends"},
            {x:stxx.masterData[l-45].DT, type:standardType, category:"filing", headline:"This is a Marker for a Filing"},
            {x:stxx.masterData[l-55].DT, type:standardType, category:"split", headline:"This is a Marker for a Split"}
        ];
        var story="Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";

        // Loop through the data and create markers
        for(var i=0;i<data.length;i++){
            var datum=data[i];
            datum.story=story;
            var params={
                stx:stxx,
                label:standardType,
                xPositioner:"date",
                x: datum.x,
                //chartContainer: true, // Allow markers to float out of chart. Set css .stx-marker{ z-index:20}
                node: new CIQ.Marker.Simple(datum)
            };

            var marker=new CIQ.Marker(params);
        }
        stxx.draw();
    }

    function resizeScreen(){
        if(!UIContext) return;
        checkWidth();
        setHeight();
        var sidePanel=$("cq-side-panel")[0];
        if(sidePanel){
            $('.ciq-chart-area').css({'right': sidePanel.nonAnimatedWidth() +'px'});
            $('cq-tradingcentral').css({'margin-right': sidePanel.nonAnimatedWidth() + 15 + 'px'});
        }
        stxx.resizeChart();
        if(stxx.slider) stxx.slider.display(stxx.layout.rangeSlider);
    }

//Range Slider; needs to be created before startUI() is called for custom themes to apply
    new CIQ.RangeSlider({stx:stxx});

    var webComponentsSupported = ('registerElement' in document &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template'));

    if(webComponentsSupported){
        startUI();
        resizeScreen();
    }else{
        window.addEventListener('WebComponentsReady', function(e) {
            startUI();
            resizeScreen();
        });
    }






    if(typeof Promise === 'undefined') CIQ.loadScript('js/thirdparty/promise.min.js'); // Necessary for IE and MSFT Edge if you are using sharing (because html2canvas uses promises)
    $(window).resize(resizeScreen);
    var currentPrice = {};








//	 document.title =   title

    var previous_price
    function fill_price ()
    {

        //console.log("***********************", stxx.chart.symbol)

        var curr =  stxx.chart.symbol.split("/")[0]
        var Symbol = stxx.chart.symbol.split("/")[1]

        var Exchange =  get_default_exchange(stxx.chart.symbol)

        //console.log("EXCHANGE", Exchange.length)




        var exchange_var
        if(typeof Exchange != 'undefined' && Exchange.length !==0 && Exchange != 'AGG')
        {
            exchange_var = "&e=" + Exchange


        }
        else{
            exchange_var = ""

        }
        if(typeof Symbol == "undefined")
        {
            Symbol = "USD"
        }
        var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + curr + "&tsyms=" + Symbol + exchange_var
        // console.log("****fill price***********url",url)

        jQuery.getJSON(url, function (data) {
            //                console.log(data.RAW[curr].USD.CHANGEPCT24HOUR)
            //console.log(data)
            var displaySymbol =data.DISPLAY[curr][Symbol].TOSYMBOL

            var val = data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2);
            // var change_div = jQuery("cq-todays-change")
            // console.log("CHANGE DIV",change_div)
            if (val > 0) {
                ///change_div.style.color = "green";
                // jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");


            } else {
                //change_div.style.color = "red";
                // jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");

            }
            //console.log(url)
            //console.log(Intl.NumberFormat("de-DE").format(data.RAW[curr][Symbol].PRICE.toFixed(5)))
            //var x = document.getElementById("curr_img");
            //x.className = "curr_img"
            //x.src = img_src;
            var title
            // jQuery("cq-todays-change").css({ 'font-size':15 });
            if( (data.RAW[curr][Symbol].PRICE) < 1 )
            {
                // console.log('+++++++++++++++++++++++++',(data.RAW[curr][Symbol].PRICE))
                // jQuery("cq-current-price").text( (data.RAW[curr][Symbol].PRICE));
                // title  =  curr + "/" + Symbol + "\u200b  "+ "\u200b  " + "\u200b  " + (data.RAW[curr][Symbol].PRICE) + " \u200b ";
            }
            else
            {
                // console.log("hhhhh",(data.RAW[curr][Symbol].PRICE).toLocaleString())
                // jQuery("cq-current-price").text( (data.RAW[curr][Symbol].PRICE).toLocaleString());
                // title  =  curr + "/" + Symbol + "\u200b  "+ "\u200b  " + "\u200b  " + (data.RAW[curr][Symbol].PRICE).toLocaleString() + " \u200b ";
            }

            // document.title = title

        });
    }
    function update_chart_price ()
    {

        //console.log("***********************", stxx.chart.symbol)

        var curr =  stxx.chart.symbol.split("/")[0]
        var Symbol = stxx.chart.symbol.split("/")[1]

        var Exchange = jQuery( "#selectExchange option:selected" ).text()

        //console.log("EXCHANGE", Exchange.length)




        var exchange_var
        if(typeof Exchange != 'undefined' && Exchange.length !==0)
        {
            exchange_var = "&e=" + Exchange


        }
        else{
            exchange_var = ""

        }
        if(typeof Symbol == "undefined")
        {
            Symbol = "USD"
        }
        var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + curr + "&tsyms=" + Symbol + exchange_var
        // console.log("***************url",url)

        jQuery.getJSON(url, function (data) {
            //                console.log(data.RAW[curr].USD.CHANGEPCT24HOUR)
            //console.log(data)
            var displaySymbol =data.DISPLAY[curr][Symbol].TOSYMBOL

            var val = data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2);
            // var change_div = jQuery("cq-todays-change")
            // console.log("CHANGE DIV",change_div)
            if (val > 0) {
                ///change_div.style.color = "green";
                // jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");
                // jQuery("#change").text('\u25b2' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");

            } else {
                //change_div.style.color = "red";
                // jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");
                // jQuery("#change").text('\u25bc' + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].CHANGEPCT24HOUR.toFixed(2)) + "%");
            }
            //console.log(url)
            //console.log(Intl.NumberFormat("de-DE").format(data.RAW[curr][Symbol].PRICE.toFixed(5)))
            //var x = document.getElementById("curr_img");
            //x.className = "curr_img"
            //x.src = img_src;
            // jQuery("cq-todays-change").css({ 'font-size':15 });



// jQuery("#volume").html(displaySymbol + " " + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].VOLUME24HOURTO.toFixed(3)));
// jQuery("#marketcap").html(displaySymbol + " " + Intl.NumberFormat("en-US").format(data.RAW[curr][Symbol].MKTCAP.toFixed(3)));




        });


    }



    setInterval(() => {
//console.log("----------")
        update_chart_price()
    }, 2000);


    function initialSymbol ()
    {

        var from,to

        var pair = "{{ from }}"+ "/" + "{{ to }}"
        var exchange = get_default_exchange(pair)
        var name = get_name("{{ from }}")
        console.log("pair",pair,"exchange",exchange,"name",name)
        var symb = {symbol: pair, name: name, exchDisp: exchange}

        stxx.newChart(symb, null, null, function(err){
            if(err){
                //TODO, symbol not found error
                if(self.loader) self.loader.hide();
                return;

            }
            setExchange()

        })
    }



    function get_default_exchange(symbol)
    {
        var arr = httpGet('https://afternoon-mountain-15657.herokuapp.com/Exchanges/' + symbol)
        var Exchange_list = JSON.parse(arr)
        if(Exchange_list.length == 0)
            return "AGG"
        Exchange = Exchange_list[0]
        return Exchange
    }

    function get_name(curr)

    {
        var array = httpGet('https://afternoon-mountain-15657.herokuapp.com/All-Coins-Aviho')
        var list = JSON.parse(array)
        var obj = list.find(o => o.FROMSYMBOL == curr)
        return obj.name

    }



    function httpGet2(url2){
        var xhr = new XMLHttpRequest();
        xhr.open( "GET", url2, false ); // false for synchronous request
        xhr.send( null );
        //console.log("xhr.responseText",xhr.responseText)
        return xhr.responseText;
    }


    function fill_select_curr()
    {
        var data  = []
        var url2= "https://afternoon-mountain-15657.herokuapp.com/MarketsAndNames"
        var mySelect = httpGet2(url2);
        var select_list = JSON.parse(mySelect)

        for (var i = 0; i < select_list[0].length; i++) {


            var obj = {
                label: select_list[0][i] + ": " + select_list[1][i],
                value: select_list[1][i]
            }
            data.push(obj)

        }

        console.log("dataaaaaaaaaaaaaaaa",data)
        jQuery(function() {
            jQuery( "#tags" ).autocomplete({
                source: function( request, response ) {
                    console.log("1",request.term)
                    var matcher = new RegExp( "^" + jQuery.ui.autocomplete.escapeRegex( request.term ), "i" );
                    response(jQuery.grep( data, function( item ){

                        return matcher.test( item.label ) || matcher.test( item.value )
                    }) );
                },
                minLength: 0
                ,
                select: function( event , ui ) {
                    event.preventDefault();
                    jQuery("#tags").val(ui.item.label);
                    console.log( "You selected: " + ui.item.label )
                    openNewChart(ui.item.label)
                }
            })
                .focus(function() {
                    console.log("val", jQuery(this))
                    jQuery(this).autocomplete("search", jQuery(this).val());
                });
        });

    }

    function openNewChart(pair)
    {



        var to_static = "USD"
        var temp_pair = pair.split(":")[0]

        var from = temp_pair.split("/")[0]
        var to = temp_pair.split("/")[1]
        var name = pair.split(":")[1].replace(" ","")
        var sym = from+"_"+to;
        var url =  Routing.generate('crypto_chart',{"currency" :sym})
        console.log(Routing.generate('crypto_chart',{"currency" :sym}))
        window.location.href = url


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////


        // var temp_pair = pair.split(":")[0]
        // var from = temp_pair.split("/")[0]
        // var to = temp_pair.split("/")[1]
        // var name = pair.split(":")[1].replace(" ","")
        // var exchange = get_default_exchange(temp_pair)
        // var symb = {symbol: temp_pair, name: name, exchDisp: exchange}
        // console.log("Will soon open ", "from",temp_pair,"to",symb,"name",name)
        // console.log("oooooooooooooo",exchange)
        // var name = get_name(from)
        // var symb = {symbol: temp_pair, name: name, exchDisp: exchange}
        // var old_curr = stxx.chart.symbol
        // var Exchange = jQuery( "#selectExchange option:selected" ).text()
        // if(Exchange. length == 0)
        // {
        //     var channel = "5~CCCAGG"
        // }
        // else
        // {
        //     var channel = "2~" + Exchange
        // }
        //
        // var my_channel = channel +"~" + old_curr.split("/")[0] + "~" + old_curr.split("/")[1]
        // subscription = [my_channel]
        // console.log("--------------",subscription)
        // socket.emit('SubRemove', { subs: subscription });
        //
        // stxx.newChart(symb, null, null, function(err){
        //     if(err){
        //         //TODO, symbol not found error
        //         if(self.loader) self.loader.hide();
        //         return;
        //
        //     }
        //
        //     fillExchange()
        //     fill_price()
        //
        //     setWS()
        // })


    }

    var currentPrice = {};
    function get_curr_symbol () {
        return stxx.chart.symbol
    }

    function get_curr_exchange () {
        return jQuery( "#selectExchange option:selected" ).text()
    }

    function setWS()
    {
        var Exchange = jQuery( "#selectExchange option:selected" ).text()
        if(Exchange.length == 0 )
        {
            var channel = "5~CCCAGG"
        }
        else
        {
            var channel = "2~" + Exchange
        }

        var my_channel =  channel + "~" + stxx.chart.symbol.split("/")[0]  + "~" + stxx.chart.symbol.split("/")[1]

        console.log("my_channel",my_channel)
        var arr = [my_channel]

//console.log(arr)


        //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
        //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
        //For aggregate quote updates use CCCAGG as market
        //var subscription = ['2~Bitfinex~BTC~USD'];
        var subscription = arr
        socket.emit('SubAdd', { subs: subscription });
        socket.on("m", function(message) {
            var messageType = message.substring(0, message.indexOf("~"));
            var res = {};
            //  console.log(messageType,CCC.STATIC.TYPE.CURRENTAGG)
            //if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {

            res = CCC.CURRENT.unpack(message);
            var curr_sym = get_curr_symbol()
            var from = curr_sym.split("/")[0]
            var to =  curr_sym.split("/")[1]
            var exch = get_curr_exchange()
            //  console.log("message",from,to,exch)
            if(res.TYPE == 2 && res.FROMSYMBOL == from && res.TOSYMBOL == to && res.MARKET == exch )
            {
                console.log("unpack",res.TYPE,res)
                dataUnpack(res);
            }



            // }
        });
    }


    var dataUnpack = function(data) {
        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
        var tsym = CCC.STATIC.CURRENCY.getSymbol(to);

        var pair = from + to;
        //console.log(pair);

        if (!currentPrice.hasOwnProperty(pair)) {
            currentPrice[pair] = {};
        }

        for (var key in data) {

            currentPrice[pair][key] = data[key];
        }
        //console.log(data)
//  	 var tt = jQuery("cq-current-price").text(  );
//      console.log("compare",currentPrice[pair]['PRICE'] ,tt )
        currentPrice[pair]['CHANGE24HOURPCT'] = (Math.abs((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR'])) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%"
        displayData(currentPrice[pair], from, tsym, fsym);
    };


    var displayData = function(current, from, tsym, fsym) {
        //display data for ONE pair
        //console.log(current);
        var priceDirection = current.FLAGS;
        var old = jQuery("cq-current-price").text(  );
        var change24hour


        var title
        var for_title
        //console.log("innnnnnnnnnnnnnnn")
        if(typeof current['PRICE'] == "undefined" || Number.isNaN(current['PRICE']))
        {
            for_title = ""
        }
        else
        {
            if(current['PRICE'] < 1)
            {
                jQuery("cq-current-price").text( (current['PRICE']));

                for_title = (current['PRICE'])
//console.log("<11111111",current['PRICE'])
            }
            else
            {
                jQuery("cq-current-price").text( (current['PRICE']).toLocaleString());

                for_title = (current['PRICE']).toLocaleString()
//console.log(">11111111",(current['PRICE']).toLocaleString())
            }


        }


        jQuery("cq-current-price").removeClass();


        if (priceDirection & 1) {
            jQuery("cq-current-price").addClass("price_up");

            if( for_title.length != 0)
                title  =  stxx.chart.symbol.replace("_","/") + "\u200b  "+ "\u200b  " +"\u25b2 " + for_title + " \u200b ";
        }
        else if (priceDirection & 2) {
            jQuery("cq-current-price").addClass("price_down");

            if( for_title.length != 0)
                title  =  stxx.chart.symbol.replace("_","/") + "\u200b  "+ "\u200b  " + "\u25bc "  + for_title + " \u200b ";

        }
        else{
            if( for_title.length != 0)
                title  =  stxx.chart.symbol.replace("_","/") + "\u200b  "+ "\u200b  " + "\u200b  " + for_title + " \u200b ";
        }
        console.log("333333333333",title)
        setTimeout(() => {
//console.log("----------")
            jQuery("cq-current-price").removeClass();

    }, 2000);
        if( for_title.length != 0)
            document.title =   title



    }



})(jQuery);

// </script>

//
//
// {#<script>#}
// {#function httpGet2(theUrl)#}
// {#{#}
//     {#var xmlHttp = new XMLHttpRequest();#}
//     {#xmlHttp.open( "GET", theUrl, false ); // false for synchronous request#}
//         {#xmlHttp.send( null );#}
//         {#return xmlHttp.responseText;#}
//         {#}#}
//     {#var buy_button=document.getElementById("buy_button");#}
//     {#buy_button.innerHTML = "BUY";#}
//
//     {#var params = window.location.search#}
//     {#var uniques#}
//     {#if (params.indexOf("source") == -1)#}
//     {#{if (document.referrer != "")#}
//         {#uniques = params + "&aff_unique2=" + document.referrer;#}
//         {#else#}
//         {#uniques = params + "&aff_unique2=organic";}#}
//
//     {#else{uniques = params.replace("utm_source", "source");#}
//         {#uniques = uniques.replace("source", "aff_unique2");}#}
//     {#uniques = uniques.replace("utm_campaign", "aff_unique3");#}
//     {#uniques = uniques.replace("ad_group", "aff_unique4");#}
//     {#uniques = uniques.replace("gclid", "aff_unique5");#}
//     {#uniques = uniques.replace("keywordid", "aff_unique1");#}
//     {#uniques = uniques.substring(uniques.lastIndexOf("?"),uniques.length);#}
//
//     {#buy_button.addEventListener('click', function(event) {#}
//         {#var array =	httpGet2('https://afternoon-mountain-15657.herokuapp.com/brokerLinkWeb')#}
//         {#var str = array.slice(9);#}
//         {#str = str.substring(0,str.lastIndexOf("\""));#}
//         {#window.open(str + uniques, '_blank' );#}
//         {#});#}
//     {#</script>#}
//         {#<script>#}
//         {#function httpGet2(theUrl)#}
//         {#{#}
//             {#var xmlHttp = new XMLHttpRequest();#}
//             {#xmlHttp.open( "GET", theUrl, false ); // false for synchronous request#}
//                 {#xmlHttp.send( null );#}
//                 {#return xmlHttp.responseText;#}
//                 {#}#}
//             {#var sell_button=document.getElementById("sell_button");#}
//             {#sell_button.innerHTML = "SELL";#}
//
//             {#var params = window.location.search#}
//             {#var uniques#}
//             {#if (params.indexOf("source") == -1)#}
//             {#{if (document.referrer != "")#}
//                 {#uniques = params + "&aff_unique2=" + document.referrer;#}
//                 {#else uniques = params + "&aff_unique2=organic";}#}
//
//             {#else{#}
//                 {#uniques = params.replace("utm_source", "source");#}
//                 {#uniques = uniques.replace("source", "aff_unique2");}#}
//             {#uniques = uniques.replace("utm_campaign", "aff_unique3");#}
//             {#uniques = uniques.replace("ad_group", "aff_unique4");#}
//             {#uniques = uniques.replace("gclid", "aff_unique5");#}
//             {#uniques = uniques.replace("keywordid", "aff_unique1");#}
//             {#uniques = uniques.substring(uniques.lastIndexOf("?"),uniques.length);#}
//             {#//console.log("uniques",uniques)#}
//
//                 {#sell_button.addEventListener('click', function(event) {#}
//                     {#var array =	httpGet2('https://afternoon-mountain-15657.herokuapp.com/brokerLinkWeb')#}
//                     {#var str = array.slice(9);#}
//                     {#str = str.substring(0,str.lastIndexOf("\""));#}
//                     {#window.open(str + uniques, '_blank' );#}
//                     {#});#}
//                 {#</script>#}