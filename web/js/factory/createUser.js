angular.module('CreateUser', [])
    .factory('CreateUser', CreateUser);
function CreateUser() {

    var User = {
        verifyData: {
            verify_id: "",
            verify_code:"",
            is_phone_number_verified:false,
            is_verify_code_sent:false
        },
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        _id: '',
        provider: '',
        platform: 'web',
        state: "unknown",
        token_notification: "",
        isAlvexo: false,
        broker: "none",
        nickname: "",
        watchlist: [],
        createAccountDate: "",
        version: "",
        countryData : {
            isRequested: false,
            city:  "",
            country:  "",
            countryCode:  "",
            region:  "",
            regionName:  "",
            timezone:  "",
            dial_code:  ""
        },
        description : ""
    };

    return User;

}
