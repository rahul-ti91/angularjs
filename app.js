var app = angular.module('BlankApp', ['ngMaterial', 'sidenavDemo1', 'autocompleteDemo', 'fabSpeedDialDemoBasicUsage', 'bottomSheet', 'ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "ClosingActivity.html"
    }).when("/ApplicationOutages", {
        templateUrl: "ApplicationOutages.html"
    }).when("/ClosingActivity", {
        templateUrl: "ClosingActivity.html"
    }).when("/ReleaseAndDRCalendar", {
        templateUrl: "ReleaseAndDRCalendar.html"
    }).when("/AppreciationsAndChallenges", {
        templateUrl: "AppreciationsAndChallenges.html"
    }).when("/Ideas", {
        templateUrl: "Ideas.html"
    }).when("/Trainings", {
        templateUrl: "Trainings.html"
    }).when("/Calendar", {
        templateUrl: "Calendar.html"
    }).when("/NonSN", {
        templateUrl: "NonSN.html"
    }).when("/Highlights", {
        templateUrl: "Highlights.html"
    }).when("/Dashboard", {
        templateUrl: "Dashboard.html"
    }).when("/Reports", {
        templateUrl: "Report.html"
    }).otherwise({
        templateUrl: "ClosingActivity.html"
    });
});


var globalData = {};
globalData.leaves = [];
globalData.outages = [];
globalData.closings = [];
globalData.releases = [];
globalData.DRs = [];
globalData.appreciations = [];
globalData.challenges = [];
globalData.ideas = [];
globalData.trainings = [];
globalData.highlights = [];
globalData.nonsn = [];

$(document).ready(function () {
    console.log(document.location.hash);

    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('#maindiv').css('min-height', windowHeight);
    };
    setHeight();
    $(window).resize(function () {
        setHeight();
    });
});
