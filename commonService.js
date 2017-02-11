angular.module("commonServiceModule", []).service("commonService", function ($http, $q) {
    this.requestMaker = function (url, method, data, successFunction, errorFunction) {
        var deferred = $q.defer();
        $http({
            method: method
            , url: url
            , headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
            , data: $.param(data || '')
        }).then(function (response) {
            console.log(response);
            deferred.resolve(response);
        }, function (response) {
            console.log(response);
            deferred.reject("error");
        });
        return deferred.promise;
    }
}).constant("baseURL", "https://cores-msr-jpa.run.aws-usw02-pr.ice.predix.io/");