angular.module('memberService', [])
    .service('MemberService', function ($http, $location) {
        var sendHttpRequest = function (url, token) {
            $http.defaults.headers.common.Authorization = `Bearer ${token}`;

            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });

            });
        };

        var getSampleSecuredPage = function (token) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/secured`;

            return sendHttpRequest(url, token);
        };

        var getSentimentsByUser = function (token) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-sentiments-by-user`;

            return sendHttpRequest(url, token);
        };

        var getLocation = function () {
            const url = 'https://xosignals.herokuapp.com/get-location'

            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {

                    //console.log("*******************1564865",response.data.country)
                    resolve(response.data.country);
                }).catch(function (error) {
                    reject(error);
                });

            });

        }

        var is_nickname_exist = function (nickname) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/is-nickname-exist/" + nickname + "/undefined"

            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });

            });
        }


        return {
            getSampleSecuredPage: getSampleSecuredPage,
            getSentimentsByUser: getSentimentsByUser,
            getLocation:getLocation,
            is_nickname_exist:is_nickname_exist
        };
    });
