angular.module('sidenavDemo1').controller('AppCtrl', function ($scope, $timeout, $rootScope, $mdSidenav, $q, $log, $rootScope, $mdToast, AppService, DataService, commonService, baseURL) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.appName = AppService.applicationName;
    $scope.dashboard = document.location.hash;
    $rootScope.hashes = ['#ClosingActivity', '#ApplicationOutages', '#ReleaseAndDRCalendar', '#AppreciationsAndChallenges', '#Ideas', '#Trainings', '#NonSN', '#Highlights', '#Calendar', '#Reports', '#Dashboard'];
    $scope.onlyMondayPredicate = function (date) {
        var day = date.getDay();
        return day === 1;
    };
    $scope.$on('$locationChangeStart', function (event) {
        var index = ($rootScope.hashes.indexOf("#" + document.location.hash.substring(2)) > -1) ? $rootScope.hashes.indexOf("#" + document.location.hash.substring(2)) : $rootScope.hashes.indexOf("#" + document.location.hash.substring(1));
        if (index > -1) {
            $rootScope.heading = $rootScope.toppings[index].name;
        }
        else {
            $rootScope.heading = $rootScope.toppings[0].name;
        }
    });
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope
                , args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID).toggle().then(function () {
                $log.debug("toggle " + navID + " is done");
            });
        }, 200);
    }

    function buildToggler(navID) {
        return function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID).toggle().then(function () {
                $log.debug("toggle " + navID + " is done");
            });
        }
    }
    $scope.activities = [];
    $scope.activity = {};
    var self = $scope;
    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.associates = loadAssociates();
    self.selectedAssociates = [];
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteDemoRequireMatch = true;
    self.transformChip = transformChip;
    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
        // Otherwise, create a new one
        return {
            name: chip
            , type: 'new'
        }
    }
    /**
     * Search for vegetables.
     */
    function querySearch(query) {
        var results = query ? self.associates.filter(createFilterFor(query)) : [];
        return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(associate) {
            return (associate._lowername.indexOf(lowercaseQuery) === 0) || (associate._lowertype.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAssociates() {
        var associates = [
            {
                'name': 'Rahul Tiwari'
                , 'empid': '5735935'
        }
            , {
                'name': 'Umesh Mishra'
                , 'empid': '593928'
        }
            , {
                'name': 'Uma Shah'
                , 'empid': '49847'
        }
            , {
                'name': 'Anshul Kewat'
                , 'empid': '907878'
        }
            , {
                'name': 'Aaroh Aggarwal'
                , 'empid': '478473'
        }
      ];
        return associates.map(function (associate) {
            associate._lowername = associate.name.toLowerCase();
            associate._lowertype = associate.empid;
            return associate;
        });
    }
    // All the Variables for html modules
    $scope.activities = [];
    $scope.activity = {};
    $scope.showSimpleToast = function (text) {
        $mdToast.show($mdToast.simple().textContent(text)
            //.position("top right")
            .hideDelay(1500));
    };
    $rootScope.itemCount = [0, 0, 0, 0, 0, 0];

    function submitter(obj, endpoint) {
        for (x in obj) {
            console.log(obj[x]);
            if (obj[x] == undefined) {
                $scope.showSimpleToast("Please Fill all the Required Details _/\\_");
                return false;
            }
        }
        console.log(commonService.requestMaker((baseURL + endpoint), "POST", obj));
        $scope.activity = {};
        return true;
    }
    $scope.addItem = function () {
            $scope.activity.app = AppService.getApplicationName();
            if ($scope.activity.app.length == 0) {
                if (document.location.hash != "#/Trainings") {
                    $scope.showSimpleToast("Please Select Application");
                    return;
                }
            }
            if (document.location.hash == "#/ClosingActivity" || document.location.hash == "#/") {
                $scope.activity.module = "ca";
                $rootScope.itemCount[0]++;
                var closing = {};
                globalData.closings.push({
                    frequency: $scope.activity.frequency
                    , app: $scope.activity.app
                    , closingDate: $scope.activity.closingDate
                    , closingDescription: $scope.activity.closingDescription
                });
                closing.frequency = $scope.activity.frequency;
                closing.applicationName = $scope.activity.app;
                closing.applicationId = AppService.getId();
                closing.activityDate = $scope.activity.closingDate;
                closing.description = $scope.activity.closingDescription;
                if (submitter(closing, "closeactivity")) {
                    $rootScope.toppings[0].wanted = true;
                    $scope.showSimpleToast("Activity has been added successfully!");
                }
                closing = {};
            }
            else if (document.location.hash == "#/ApplicationOutages") {
                $scope.activity.module = "ao";
                $rootScope.itemCount[1]++;
                var outage = {};
                globalData.outages.push({
                    aoOutageType: $scope.activity.aoOutageType
                    , app: $scope.activity.app
                    , aoDuration: $scope.activity.aoDuration
                    , aoDate: $scope.activity.aoDate
                    , aoStartTime: $scope.activity.aoStartTime
                    , aoRca: $scope.activity.aoRca
                    , aoOutageReason: $scope.activity.aoOutageReason
                });
                outage.outageType = $scope.activity.aoOutageType;
                outage.applicationName = $scope.activity.app;
                outage.applicationId = AppService.getId();
                outage.duration = $scope.activity.aoDuration;
                outage.outageDate = $scope.activity.aoDate;
                outage.startTime = $scope.activity.aoStartTime;
                outage.rcaDone = ($scope.activity.aoRca == "Yes") ? "true" : "false";
                outage.outageReason = $scope.activity.aoOutageReason;
                if (submitter(outage, "outages")) {
                    $rootScope.toppings[1].wanted = true;
                    $scope.showSimpleToast("Outage has been added successfully!");
                }
                //console.log(commonService.requestMaker((baseURL + "outages"), "POST", outage));
                outage = {};
            }
            else if (document.location.hash == "#/ReleaseAndDRCalendar") {
                $scope.activity.module = "rc";
                $rootScope.itemCount[2]++;
                var release = {};
                globalData.releases.push({
                    lastreleasedate: $scope.activity.rcLastReleaseDate
                    , upcomingreleasedate: $scope.activity.rcUpcomingReleaseDate
                    , app: $scope.activity.app
                });
                release.releaseCompletionDate = $scope.activity.rcLastReleaseDate;
                release.upcomingReleaseDate = $scope.activity.rcUpcomingReleaseDate;
                release.applicationName = $scope.activity.app;
                release.applicationId = AppService.getId();
                if (release.releaseCompletionDate != undefined && release.upcomingReleaseDate != undefined) {
                    console.log(commonService.requestMaker((baseURL + "releasecalendar"), "POST", release));
                    $scope.showSimpleToast("Relese/DR Calendar has been added successfully!");
                    $rootScope.toppings[2].wanted = true;
                }
                release = {};
                var dr = {};
                globalData.DRs.push({
                    completiondate: $scope.activity.rcCompletionDate
                    , planneddate: $scope.activity.rcPlannedDate
                    , app: $scope.activity.app
                });
                dr.drCompletionDate = $scope.activity.rcCompletionDate;
                dr.upcomingDRDate = $scope.activity.rcPlannedDate;
                dr.applicationName = $scope.activity.app;
                dr.applicationId = AppService.getId();
                if (dr.drCompletionDate != undefined && dr.upcomingDRDate != undefined) {
                    console.log(commonService.requestMaker((baseURL + "drcalendar"), "POST", dr));
                    $scope.showSimpleToast("Relese/DR Calendar has been added successfully!");
                    $rootScope.toppings[2].wanted = true;
                }
                dr = {};
            }
            else if (document.location.hash == "#/AppreciationsAndChallenges") {
                $scope.activity.module = "ac";
                $rootScope.itemCount[3]++;
                var appreciation = {};
                globalData.appreciations.push({
                    app: $scope.activity.app
                    , appreciation: $scope.activity.appreciation
                });
                appreciation.applicationName = $scope.activity.app;
                appreciation.applicationId = AppService.getId();
                appreciation.appreciation = $scope.activity.appreciation;
                if (appreciation.appreciation != undefined) {
                    console.log(commonService.requestMaker((baseURL + "appreciations"), "POST", appreciation));
                }
                appreciation = {};
                var challenge = {};
                globalData.challenges.push({
                    app: $scope.activity.app
                    , issue: $scope.activity.issue
                });
                challenge.applicationName = $scope.activity.app;
                challenge.applicationId = AppService.getId();
                challenge.issue = $scope.activity.issue;
                if (challenge.issue != undefined) {
                    console.log(commonService.requestMaker((baseURL + "coresissues"), "POST", challenge));
                    $scope.showSimpleToast("Appreciation/Challenge has been added successfully!");
                    $rootScope.toppings[3].wanted = true;
                }
                if (challenge.issue == undefined && challenge.appreciation == undefined) {
                    submitter(challenge, "");
                }
                challenge = {};
            }
            else if (document.location.hash == "#/Ideas") {
                $scope.activity.module = "is";
                $rootScope.itemCount[4]++;
                var idea = {};
                globalData.ideas.push({
                    app: $scope.activity.app
                    , state: $scope.activity.ideaState
                    , description: $scope.activity.ideaDescription
                    , benefits: $scope.activity.businessBenefits
                    , plan: $scope.activity.implementationPlan
                });
                idea.applicationName = $scope.activity.app;
                idea.applicationId = AppService.getId();
                idea.ideaState = $scope.activity.ideaState;
                idea.ideaDescription = $scope.activity.ideaDescription;
                idea.businessBenefits = $scope.activity.businessBenefits;
                idea.implamentationPlan = $scope.activity.implementationPlan;
                if (submitter(idea, "ideas")) {
                    $scope.showSimpleToast("Idea has been added successfully!");
                    $rootScope.toppings[4].wanted = true;
                }
                //console.log(commonService.requestMaker((baseURL + "ideas"), "POST", idea));
                idea = {};
            }
            else if (document.location.hash == "#/Trainings") {
                $scope.activity.module = "tr";
                $rootScope.itemCount[5]++;
                var training = {};
                globalData.trainings.push({
                    selectedAssociates: $scope.selectedAssociates
                    , associatename: $scope.activity.selectedAssociates
                    , type: $scope.activity.trainingType
                    , name: $scope.activity.trainingName
                });
                $scope.activity.selectedAssociates = $scope.selectedAssociates;
                training.trainingType = $scope.activity.trainingType;
                training.trainingName = $scope.activity.trainingName;
                if (training.trainingType == undefined || training.trainingName == undefined || $scope.activity.selectedAssociates.length == 0) {
                    submitter(training, "");
                }
                else {
                    for (var f = 0; f < $scope.activity.selectedAssociates.length; f++) {
                        training.empName = $scope.activity.selectedAssociates[f].name;
                        training.empId = $scope.activity.selectedAssociates[f].empid;
                        console.log(commonService.requestMaker((baseURL + "trainings"), "POST", training));
                    }
                    $scope.showSimpleToast("Training has been added successfully!");
                    $rootScope.toppings[5].wanted = true;
                }
                training = {};
            }
            else if (document.location.hash == '#/Highlights') {
                $scope.activity.module = 'hi';
                var highlight = {};
                globalData.highlights.push({
                    week: $scope.activity.weekDay
                    , app: $scope.activity.app
                    , highlight: $scope.activity.highlight
                });
                highlight.week = $scope.activity.weekDay;
                highlight.applicationName = $scope.activity.app;
                highlight.applicationId = AppService.getId();
                highlight.highlights = $scope.activity.highlight;
                if (submitter(highlight, "weeklyhighlights")) {
                    $scope.showSimpleToast("Highlight has been added successfully!");
                    $rootScope.toppings[7].wanted = true;
                }
                //console.log(commonService.requestMaker((baseURL + "weeklyhighlights"), "POST", highlight));
                highlight = {};
            }
            else if (document.location.hash == '#/NonSN') {
                $scope.activity.module = 'sn';
                var nonsn = {};
                globalData.nonsn.push({
                    week: $scope.activity.snweekDay
                    , app: $scope.activity.app
                    , nonsndata: $scope.activity.nonsndata
                });
                nonsn.week = $scope.activity.snweekDay;
                nonsn.applicationName = $scope.activity.app;
                nonsn.applicationId = AppService.getId();
                nonsn.nonsndata = $scope.activity.nonsndata;
                if (submitter(nonsn, "nonsndata")) {
                    $scope.showSimpleToast("NON-SN Data has been added successfully!");
                    $rootScope.toppings[6].wanted = true;
                }
                //console.log(commonService.requestMaker((baseURL + "nonsndata"), "POST", nonsn));
                nonsn = {};
            }
            $scope.activities.push(angular.copy($scope.activity));
            console.log($scope.activities);
            DataService.data = $scope.activities;
            //$scope.activity = {};
        }
        //variables part end
})