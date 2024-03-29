// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE QUOTEFEED IMPLEMENTATION -- Connects charts to ChartIQ Simulator
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------

/*    eslint   */ /*   jshint   */
/* globals CIQ */ /* global CIQ */

var quotefeedSimulator={}; // the quotefeed object
var quoteFeedSimulator=quotefeedSimulator; // prevent typos

/**
 * Convenience function for generating a globally unique id (GUID).
 * See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @return {string} An RFC4122 version 4 compliant UUID
 * @private
 */
quotefeedSimulator.generateGUID=function(){
	var d = new Date().getTime();
	if(window.performance && typeof window.performance.now === "function"){
		d += window.performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

quotefeedSimulator.maxTicks=50000;
quotefeedSimulator.url="https://simulator.chartiq.com/datafeed";
quotefeedSimulator.url += "?session=" + quotefeedSimulator.generateGUID(); // add on unique sessionID required by ChartIQ simulator;

// called by chart to fetch initial data
quotefeedSimulator.fetchInitialData=function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    // console.log('********************',symbol,params)
    // var queryUrl = this.url +
		// "&identifier=" + symbol +
		// "&startdate=" + suggestedStartDate.toISOString()  +
		// "&enddate=" + suggestedEndDate.toISOString()  +
		// "&interval=" + params.interval +
		// "&period=" + params.period +
		// "&extended=" + (params.stx.extendedHours?1:0);   // using filter:true for after hours


    // var queryUrl =
    //             "https://interactivecrypto.herokuapp.com/InitialFeed-Crypto/" +
    //             'BTC_USD' +
    //             "/" +
    //            'none' +
    //             "/a/" +
    //             suggestedEndDate.toISOString() +
    //             "/" +
    //             'minute' +
    //             "/" +
    //             '60'

    // //************
    if (params.symbolObject.group == 'crypto') {
        //console.log("if crypto")
        var queryUrl =
            "https://interactivecrypto.herokuapp.com/InitialFeed-Crypto/" +
            params.symbolObject.symbol +
            "/" +
            params.symbolObject.exchDisp +
            "/a/" +
            suggestedEndDate.toISOString() +
            "/" +
            params.interval +
            "/" +
            params.period

        //console.log("INITIAL", params.interval, params.period, queryUrl)
    }
    else if (params.symbolObject.group == 'forex') {
        var queryUrl =
            "https://interactivecrypto.herokuapp.com/InitialFeed-Forex/" +
            params.symbolObject.symbol +
            "/a/" +
            suggestedEndDate.toISOString() +
            "/" +
            params.interval +
            "/" +
            params.period
        //console.log("symbol", symbol, "suggestedStartDate",suggestedStartDate,"suggestedEndDate",suggestedEndDate, "params",params, "cb",cb)
        //console.log("INITIAL", params.interval, params.period, queryUrl)
    }

    else if (params.symbolObject.group == 'stock') {
        var queryUrl =
            "https://interactivecrypto.herokuapp.com/InitialFeed-Stock/" +
            params.symbolObject.symbol +
            "/" +
            params.symbolObject.country +
            "/a/" +
            suggestedEndDate.toISOString() +
            "/" +
            params.interval +
            "/" +
            params.period
    }
	 // //**************
    //console.log('queryUrl',queryUrl)
	CIQ.postAjax(queryUrl, null, function(status, response){
		//console.log('***',response)
		// process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
			var newQuotes = quotefeedSimulator.formatChartData(response);
            //console.log('newQuotes',newQuotes)
			cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
		} else { // else error response from datafeed
			cb({error:(response?response:status)});	// specify error in callback
		}
	});
};

// called by chart to fetch update data
quotefeedSimulator.fetchUpdateData=function (symbol, startDate, params, cb) {
    //console.log('queryUrl',startDate,params,cb)

    // var queryUrl = this.url +
		// "&identifier=" + symbol +
		// "&startdate=" + startDate.toISOString()  +
		// "&interval=" + params.interval +
		// "&period=" + params.period +
		// "&extended=" + (params.stx.extendedHours?1:0);   // using filter:true for after hours
    //

    var current_date = new Date()
    // var queryUrl = 'https://interactivecrypto.herokuapp.com/getCryptoUpdate/' +
    //             'BTC_USD' +
    //             "/" +
    //             'none' +
    //             '/' +
    //             'minute' + '/' + '60' + '/' + current_date.toISOString()

    // //**************

    if (params.symbolObject.group == 'crypto') {
        var queryUrl = 'https://interactivecrypto.herokuapp.com/getCryptoUpdate/' +
            params.symbolObject.symbol +
            "/" +
            params.symbolObject.exchDisp +
            '/' +
            params.interval + '/' + params.period + '/' + current_date.toISOString()
    }
    else if (params.symbolObject.group == 'forex') {
        var queryUrl =
            "https://interactivecrypto.herokuapp.com/getForexUpdate/" +
            params.symbolObject.symbol +
            "/" +
            current_date.toISOString() +
            "/" +
            params.interval +
            "/" +
            params.period
    }
    //**************
    // else if (params.symbolObject.group == 'stock') {
    //     var queryUrl =
    //         "https://interactivecrypto.herokuapp.com/InitialFeed-Stock/" +
    //         params.symbolObject.symbol +
    //         "/" +
    //         params.symbolObject.country +
    //         "/a/" +
    //         current_date.toISOString() +
    //         "/" +
    //         params.interval +
    //         "/" +
    //         params.period
    // }
    // //**************
    //console.log('queryUrl**',queryUrl)
	CIQ.postAjax(queryUrl, null, function(status, response){

        //console.log('***',response)
        // process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
			var newQuotes = quotefeedSimulator.formatChartData(response);
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data
		} else { // else error response from datafeed
			cb({error:(response?response:status)});	// specify error in callback
		}
	});
};
// //
// // called by chart to fetch pagination data
// quotefeedSimulator.fetchPaginationData=function (symbol, suggestedStartDate, endDate, params, cb) {
// 	var queryUrl = this.url +
// 		"&identifier=" + symbol +
// 		"&startdate=" + suggestedStartDate.toISOString()  +
// 		"&enddate=" + endDate.toISOString()  +
// 		"&interval=" + params.interval +
// 		"&period=" + params.period +
// 		"&extended=" + (params.stx.extendedHours?1:0);   // using filter:true for after hours
//
// 	CIQ.postAjax(queryUrl, null, function(status, response){
//        // console.log('*fetchPaginationData**',response)
// 		// process the HTTP response from the datafeed
// 		if(status==200){ // if successful response from datafeed
// 			var newQuotes = quotefeedSimulator.formatChartData(response);
// 			cb({quotes:newQuotes, moreAvailable:suggestedStartDate.getTime()>0, attribution:{source:"simulator", exchange:"RANDOM"}}); // return fetched data (and set moreAvailable)
// 		} else { // else error response from datafeed
// 			cb({error:(response?response:status)});	// specify error in callback
// 		}
// 	});
// };

// utility function to format data for chart input; given simulator was designed to work with library, very little formatting is needed
quotefeedSimulator.formatChartData=function (response) {
	var feeddata=JSON.parse(response);
	var newQuotes=[];
	for(var i=0;i<feeddata.length;i++){
		newQuotes[i]={};
		newQuotes[i].DT=new Date(feeddata[i].DT); // DT is a string in ISO format, make it a Date instance
		newQuotes[i].Open=feeddata[i].Open;
		newQuotes[i].High=feeddata[i].High;
		newQuotes[i].Low=feeddata[i].Low;
		newQuotes[i].Close=feeddata[i].Close;
		newQuotes[i].Volume=feeddata[i].Volume;
	}
	return newQuotes;
};
