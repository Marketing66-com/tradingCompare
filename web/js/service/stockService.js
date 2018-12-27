angular.module('stockService', ['memberService'])
    .service('StockService', function ($http,MemberService) {

        var itemsDetails = [];

        var getAllStock = function (country_value) {
            const url = 'https://websocket-stock.herokuapp.com/stocks/' + country_value

            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    var result = response.data;
                    console.log("result",result)
                    var j = 0
                    for (const key in result) {
                        if (result.hasOwnProperty(key)) {

                            itemsDetails[j] = result[key];

                            //NAME
                            itemsDetails[j].complete_name = itemsDetails[j].name
                            if (itemsDetails[j].name.length >=17)
                                itemsDetails[j].name = itemsDetails[j].name.substr(0, 17);

                            //IMAGE
                            var img = "https://storage.googleapis.com/iex/api/logos/" + key + ".png"
                            if(itemsDetails[j].img == undefined || typeof itemsDetails[j].img == "undefined" || img == undefined || typeof img == "undefined")
                                itemsDetails[j].img = "/img/Stock_Logos/stocks.png"
                            else
                                itemsDetails[j].img = img

                            // SENTIMENT
                            var sent=(result[key].likes / (result[key].likes + result[key].unlikes)) *100
                            itemsDetails[j].sentiment=Number(sent.toFixed(1))

                            //WATCHLIST
                            itemsDetails[j].is_in_watchlist = false

                            //SENTIMENT USER
                            itemsDetails[j].is_sentiment = 'CLOSE'
                            itemsDetails[j].sentiment_type = 'none'

                            j = j+1;
                        }
                    }
                    resolve(itemsDetails);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        var getAuth = function () {
            return new Promise(function (resolve, reject) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        userLoggedIn = true;
                        user.getIdToken(true).then(function (idToken) {
                            console.log("getIdToken")
                            _id = {
                                _id: user.uid
                            }
                            MemberService.getUsersById(idToken, _id).then(function (results) {
                                console.log("getUsersById",results)
                                var userDB = results.data
                                resolve(userDB);
                            })
                            .catch(function (error) {
                                    data = error;
                                    console.log("$scope.data", data)
                            })
                        }).catch(function (error) {
                            console.log('ERROR: ', error)
                        });
                    }
                    else{
                        userLoggedIn = false;
                        resolve('no user');
                    }

                })
            })
        }





        return {
            getAllStock:getAllStock,
            getAuth:getAuth
        };
    });
