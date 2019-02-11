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

        var is_nickname_exist = function (nickname,_id) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/is-nickname-exist/" + nickname + "/" + _id
            console.log("url", url)
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

        var getSentimentsByUser = function (token, id) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-sentiments-by-user`;

            return sendHttpRequest(url, token);
        };

        var Add_sentiment = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/add-sentiment`;

            return sendPostHttpRequest(url, token, data);
        };

        var Close_sentiment = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/close-sentiment`;

            return sendPostHttpRequest(url, token, data);
        };

        var getFollowingOfUser = function (token) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-following-of-user`;

            return sendHttpRequest(url, token);
        };

        var Remove_follow = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/remove-follow`;

            return sendPostHttpRequest(url, token, data);
        };

        var Add_follow = function (token, data) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/add-follow`;

            return sendPostHttpRequest(url, token, data);
        };
        var getFollowers = function (token) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-followers`;

            return sendHttpRequest(url, token);
        };

        var getCommentsByID = function (token) {
            const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/get-comments-by-id`;

            return sendHttpRequest(url, token);
        };


        var createOtherUser = function (user) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/getUsersById"

            return new Promise(function (resolve, reject) {
                $http.post(url, user, config).then(function(response){
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        var getOtherFollowing = function (id) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/get-following/"+id
            // console.log("url", url)
            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
        var getOtherFollowers = function (id) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/get-followers/"+id
            // console.log("url", url)
            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
        var getOtherComments = function (id) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/get-comments-by-id/"+id
            // console.log("url", url)
            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
        var getOtherSentiments = function (id) {
            const url = "https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-by-user/"+id
            // console.log("url", url)
            return new Promise(function (resolve, reject) {
                $http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        // var Add_follow = function (user) {
        //     const url = "https://xosignals.herokuapp.com/trading-compare-v2/add-follow"
        //
        //     return new Promise(function (resolve, reject) {
        //         $http.post(url, user, config).then(function(response){
        //             resolve(response);
        //         }).catch(function (error) {
        //             reject(error);
        //         });
        //     });
        // }


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
            Delete_from_watchlist:Delete_from_watchlist,
            Add_sentiment:Add_sentiment,
            Close_sentiment:Close_sentiment,
            getFollowingOfUser:getFollowingOfUser,
            Remove_follow:Remove_follow,
            Add_follow:Add_follow,
            getFollowers:getFollowers,
            getCommentsByID:getCommentsByID,
            getOtherFollowing:getOtherFollowing,
            getOtherFollowers:getOtherFollowers,
            getOtherSentiments:getOtherSentiments,
            getOtherComments:getOtherComments,
            createOtherUser:createOtherUser
        };
    });
