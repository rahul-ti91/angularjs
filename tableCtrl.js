angular.module('sidenavDemo1').controller("customTableCtrl", demoController)
demoController.$inject = ["NgTableParams", "ReportService", "$scope"];

function demoController(NgTableParams, ReportService, $scope) {
    var self = this;
    $scope.reportOptions = ('Completed Defaulters').split(' ').map(function (states) {
        return {
            options: states
        };
    });
    $scope.downloadMSR = function () {
        window.location.href = "https://rahul-mscores-exlprov.run.aws-usw02-pr.ice.predix.io/Report?month=3";
    }
    $scope.reportMonths = ('January February March April May June July August September October November December').split(' ').map(function (states) {
        return {
            options: states
        };
    });
    $scope.reportYears = ('2017 2018 2019 2020').split(' ').map(function (states) {
        return {
            options: states
        };
    });
    ReportService.getReportData("completionStatus").then(function (data) {
        self.customConfigParams = createUsingFullOptions(data);
    });
    ReportService.getReportData("closeActivity").then(function (data) {
        self.closeActivity = createUsingFullOptions(data.closeActivities);
        self.outages = createUsingFullOptions(data.outages);
        self.appreciations = createUsingFullOptions(data.appreciations);
        self.issues = createUsingFullOptions(data.coresIssues);
        self.ideas = createUsingFullOptions(data.ideas);
        self.trainings = createUsingFullOptions(data.trainings);
        self.nonSN = createUsingFullOptions(data.nonsnDatas);
        self.leaves = createUsingFullOptions(data.leaveCalendars);
        self.releaseCal = createUsingFullOptions(data.releaseCalendars);
        self.drCal = createUsingFullOptions(data.drcalendars);
        self.weeklyHighlights = createUsingFullOptions(data.weeklyHighlights);
    })

    function createUsingFullOptions(data) {
        var initialParams = {
            count: 6 // initial page size
        };
        var initialSettings = {
            // page size buttons (right set of buttons in demo)
            counts: [], // determines the pager buttons (left set of buttons in demo)
            paginationMaxBlocks: 13
            , paginationMinBlocks: 2
            , dataset: data
        };
        return new NgTableParams(initialParams, initialSettings);
    }
}