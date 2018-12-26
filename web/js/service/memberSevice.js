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

        var sendPostHttpRequest = function (url, token, data) {
            $http.defaults.headers.common.Authorization = `Bearer ${token}`;

            return new Promise(function (resolve, reject) {
                $http.post(url, data, config).then(function(response){
                    resolve(response);
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
            const url = 'https://api.ipstack.com/check?access_key=63abaa19691754779cebd0addbfe2914'

            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
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

        var createUser = function (user) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/createUser"

            return new Promise(function (resolve, reject) {
                $http.post(url, user, config).then(function(response){
                     resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        var sendVerifyCode = function (token,user) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/send-user-verify-code`;

            return sendPostHttpRequest(url, token, user);
        }

        var updateUser = function (token, update_data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/update_fields`;

            return sendPostHttpRequest(url, token, update_data);
        }

        var checkCode = function (token, code) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/check_code`;

            return sendPostHttpRequest(url, token, code);
        }

        var getUsersById = function (token, id) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-user-by-id`;

            return sendPostHttpRequest(url, token, id);
        };

        var Add_to_watchlist = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/add-to-watchlist`;

            return sendPostHttpRequest(url, token, data);
        };

        var Delete_from_watchlist = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/delete-from-watchlist`;

            return sendPostHttpRequest(url, token, data);
        };

        return {
            getSampleSecuredPage: getSampleSecuredPage,
            sendPostHttpRequest:sendPostHttpRequest,
            getSentimentsByUser: getSentimentsByUser,
            getLocation:getLocation,
            is_nickname_exist:is_nickname_exist,
            createUser:createUser,
            sendVerifyCode:sendVerifyCode,
            updateUser:updateUser,
            checkCode:checkCode,
            getUsersById:getUsersById,
            Add_to_watchlist:Add_to_watchlist,
            Delete_from_watchlist:Delete_from_watchlist
        };
    });
