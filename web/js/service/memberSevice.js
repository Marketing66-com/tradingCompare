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

        return {
            getSampleSecuredPage: getSampleSecuredPage,
            getSentimentsByUser: getSentimentsByUser
        };
    });
