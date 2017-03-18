angular.module('sidenavDemo1').service("ReportService", function ($http, $q) {
    var MSRURL = "https://cores-msr-jpa.run.aws-usw02-pr.ice.predix.io/report?month=3";
    var result = [];
    var rawResult;

    function getRawData() {
        var defer = $q.defer();
        $http.get(MSRURL).success(function (response) {
            defer.resolve(response);
        }).error(function (response) {
            defer.reject(response);
        });
        return defer.promise;
    }
    this.getReportData = function (reportType) {
        if (reportType == "completionStatus") {
            var defer = $q.defer();
            $http.get(MSRURL).success(function (res) {
                for (var d = 0; d < Object.keys(res).length; d++) {
                    console.log(res[Object.keys(res)[d]].length + "  " + Object.keys(res)[d])
                    if (res[Object.keys(res)[d]].length > 0) {
                        for (var f = 0; f < res[Object.keys(res)[d]].length; f++) {
                            result.push({
                                application: res[Object.keys(res)[d]][f].applicationName
                                , module: Object.keys(res)[d]
                                , month: "March"
                                , completed: 100
                            });
                        }
                    }
                }
                defer.resolve(result.filter(function (obj, pos, arr) {
                    return arr.map(mapObj => mapObj["application"] + mapObj["module"]).indexOf(obj["application"] + obj["module"]) === pos;
                }));
            }).error(function (response) {
                defer.reject(response);
            });
            return defer.promise;
        }
        else if (reportType == "closeActivity") {
            return getRawData();
        }
    }
})