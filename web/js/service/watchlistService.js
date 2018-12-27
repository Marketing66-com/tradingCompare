angular.module('watchlistService', [])
    .service('WatchlistService', function ($http) {

        var WatchlistCrypto = []; var WatchlistForex = [];

        var stockForWatchlist = function (stock) {

            return new Promise(function (resolve, reject) {
                $http.get("https://websocket-stock.herokuapp.com/Getstocks/" + stock)
                    .then(function (response) {
                       //console.log("response",response)
                        if (!Object.keys(response.data).length > 0) {
                            $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + stock)
                                .then(function (res) {
                                    console.log("res DB",res)
                                    res.data.pair = res.data.symbol
                                    //NAME
                                    res.data.name = res.data.symbol
                                    res.data.complete_name = res.data.name
                                    if (res.data.name.length >= 17)
                                        res.data.name = res.data.name.substr(0, 17);

                                    //IMAGE
                                    var img = "https://storage.googleapis.com/iex/api/logos/" + stock + ".png"
                                    if (res.data.img == undefined || typeof res.data.img == "undefined" || img == undefined || typeof img == "undefined")
                                        res.data.img = "/img/Stock_Logos/stocks.png"
                                    else
                                        res.data.img = img

                                    // SENTIMENT
                                    res.data.sentiment = 50

                                    //TYPE
                                    res.data.type = 'STOCK'

                                    resolve (res.data)
                                });
                        }
                        else{
                            //NAME
                            response.data.complete_name = response.data.name
                            if (response.data.name.length >= 17)
                                response.data.name = response.data.name.substr(0, 17);

                            //IMAGE
                            var img = "https://storage.googleapis.com/iex/api/logos/" + stock + ".png"
                            if (response.data.img == undefined || typeof response.data.img == "undefined" || img == undefined || typeof img == "undefined")
                                response.data.img = "/img/Stock_Logos/stocks.png"
                            else
                                response.data.img = img

                            // SENTIMENT
                            var sent = (response.data.likes / (response.data.likes + response.data.unlikes)) * 100
                            response.data.sentiment = Number(sent.toFixed(1))

                            //TYPE
                            response.data.type = 'STOCK'

                            resolve (response.data)
                        }
                    })
            })
        }

        var cryptoForWatchlist = function (Wcrypto,strCrypto){

            return new Promise(function (resolve, reject) {
                if(Wcrypto.length>0) {
                    strCrypto = strCrypto.substring(0, strCrypto.length - 1);
                    $http.get("https://crypto.tradingcompare.com/AllPairs/" + strCrypto)
                        .then(function (response) {
                            console.log("response crypto",response.data)
                            if (Wcrypto.length > 1) {
                                for (const key in response.data) {
                                    //NAME
                                    if(response.data[key].name.substr(response.data[key].name.length - 1) == ' ')
                                        response.data[key].name = response.data[key].name.substring(0, response.data[key].name.length - 1);
                                    response.data[key].complete_name = response.data[key].name
                                    if (response.data[key].name.length >=17)
                                        response.data[key].name = response.data[key].name.substr(0, 17);

                                    //IMAGE
                                    if(response.data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                                        response.data[key].img == undefined
                                        || typeof response.data[key].img== "undefined"){

                                        response.data[key].img = "/img/crypto_logos/crypto-other.png"
                                    }

                                    //SENTIMENT
                                    var sent=(response.data[key].likes / (response.data[key].likes + response.data[key].unlikes)) *100
                                    response.data[key].sentiment=Number(sent.toFixed(1))

                                    //TYPE
                                    response.data[key].type = 'CRYPTO'

                                    WatchlistCrypto.push(response.data[key])
                                }
                            }
                            else {
                                if(response.data.name.substr(response.data.name.length - 1) == ' ')
                                    response.data.name = response.data.name.substring(0, response.data.name.length - 1);
                                response.data.complete_name = response.data.name
                                if (response.data.name.length >=17)
                                    response.data.name = response.data.name.substr(0, 17);

                                //IMAGE
                                if(response.data.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                                    response.data.img == undefined
                                    || typeof response.data.img== "undefined"){

                                    response.data.img = "/img/crypto_logos/crypto-other.png"
                                }

                                //SENTIMENT
                                var sent=(response.data.likes / (response.data.likes + response.data.unlikes)) *100
                                response.data.sentiment=Number(sent.toFixed(1))

                                //TYPE
                                response.data.type = 'CRYPTO'

                                WatchlistCrypto.push(response.data)
                            }
                            resolve (WatchlistCrypto)
                        });
                }
                else{
                    resolve (WatchlistCrypto)
                }

            });
        }
        var forexForWatchlist = function (Wforex,strForex){

            return new Promise(function (resolve, reject) {
                if(Wforex.length>0) {
                    strForex = strForex.substring(0, strForex.length - 1);
                    $http.get("https://forex.tradingcompare.com/all_data/" + strForex)
                        .then(function (response) {
                            console.log("response forex",response.data)
                            if (Wforex.length > 1) {
                                for (const key in response.data) {
                                    //NAME
                                    response.data[key].complete_name = response.data[key].name

                                    //IMAGE
                                    if(response.data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                                        response.data[key].img == undefined
                                        || typeof response.data[key].img== "undefined"){

                                        response.data[key].img =  "/img/Stock_Logos/stocks.png"
                                    }

                                    //SENTIMENT
                                    var sent=(response.data[key].likes / (response.data[key].likes + response.data[key].unlikes)) *100
                                    response.data[key].sentiment=Number(sent.toFixed(1))

                                    //TYPE
                                    response.data[key].type = 'FOREX'

                                    WatchlistForex.push(response.data[key])
                                }
                            }
                            else {
                                //NAME
                                response.data.complete_name = response.data.name

                                //IMAGE
                                if(response.data.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                                    response.data.img == undefined
                                    || typeof response.data.img== "undefined"){

                                    response.data.img =  "/img/Stock_Logos/stocks.png"
                                }

                                //SENTIMENT
                                var sent=(response.data.likes / (response.data.likes + response.data.unlikes)) *100
                                response.data.sentiment=Number(sent.toFixed(1))

                                //TYPE
                                response.data.type = 'FOREX'

                                WatchlistForex.push(response.data)
                            }
                            resolve (WatchlistForex)
                        });
                }
                else{
                    resolve (WatchlistForex)
                }

            });
        }


        return {
            stockForWatchlist:stockForWatchlist,
            cryptoForWatchlist:cryptoForWatchlist,
            forexForWatchlist:forexForWatchlist,
        };
    });
