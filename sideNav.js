angular.module('sidenavDemo1', ['ngMaterial', 'autocompleteDemo', 'ngTable', 'commonServiceModule']).service("DataService", function () {
    this.data = [];
}).service("ReportService", function ($http, $q) {

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
                                application: res[Object.keys(res)[d]][f].applicationName,
                                module: Object.keys(res)[d],
                                month: "March",
                                completed: 100
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
        } else if (reportType == "closeActivity") {
            return getRawData();
        }
    }
}).controller('AppCtrl', function ($scope, $timeout, $rootScope, $mdSidenav, $q, $log, $rootScope, $mdToast, AppService, DataService, commonService, baseURL) {
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
        } else {
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
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
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
            name: chip,
            type: 'new'
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
                'name': 'Rahul Tiwari',
                'empid': '5735935'
        }
            , {
                'name': 'Umesh Mishra',
                'empid': '593928'
        }
            , {
                'name': 'Uma Shah',
                'empid': '49847'
        }
            , {
                'name': 'Anshul Kewat',
                'empid': '907878'
        }
            , {
                'name': 'Aaroh Aggarwal',
                'empid': '478473'
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
                $scope.showSimpleToast("Activity has been added successfully!");
                $rootScope.itemCount[0]++;
                $rootScope.toppings[0].wanted = true;
                var closing = {};
                globalData.closings.push({
                    frequency: $scope.activity.frequency,
                    app: $scope.activity.app,
                    closingDate: $scope.activity.closingDate,
                    closingDescription: $scope.activity.closingDescription
                });
                closing.frequency = $scope.activity.frequency;
                closing.applicationName = $scope.activity.app;
                closing.applicationId = AppService.getId();
                closing.activityDate = $scope.activity.closingDate;
                closing.description = $scope.activity.closingDescription;
                console.log(commonService.requestMaker((baseURL + "closeactivity"), "POST", closing));
                closing = {};
            } else if (document.location.hash == "#/ApplicationOutages") {
                $scope.activity.module = "ao";
                $scope.showSimpleToast("Outage has been added successfully!");
                $rootScope.itemCount[1]++;
                $rootScope.toppings[1].wanted = true;
                var outage = {};
                globalData.outages.push({
                    aoOutageType: $scope.activity.aoOutageType,
                    app: $scope.activity.app,
                    aoDuration: $scope.activity.aoDuration,
                    aoDate: $scope.activity.aoDate,
                    aoStartTime: $scope.activity.aoStartTime,
                    aoRca: $scope.activity.aoRca,
                    aoOutageReason: $scope.activity.aoOutageReason
                });
                outage.outageType = $scope.activity.aoOutageType;
                outage.applicationName = $scope.activity.app;
                outage.applicationId = AppService.getId();
                outage.duration = $scope.activity.aoDuration;
                outage.outageDate = $scope.activity.aoDate;
                outage.startTime = $scope.activity.aoStartTime;
                outage.rcaDone = ($scope.activity.aoRca == "Yes") ? "true" : "false";
                outage.outageReason = $scope.activity.aoOutageReason;
                console.log(commonService.requestMaker((baseURL + "outages"), "POST", outage));
                outage = {};
            } else if (document.location.hash == "#/ReleaseAndDRCalendar") {
                $scope.activity.module = "rc";
                $scope.showSimpleToast("Relese/DR Calendar has been added successfully!");
                $rootScope.itemCount[2]++;
                $rootScope.toppings[2].wanted = true;
                var release = {};
                globalData.releases.push({
                    lastreleasedate: $scope.activity.rcLastReleaseDate,
                    upcomingreleasedate: $scope.activity.rcUpcomingReleaseDate,
                    app: $scope.activity.app
                });
                release.releaseCompletionDate = $scope.activity.rcLastReleaseDate;
                release.upcomingReleaseDate = $scope.activity.rcUpcomingReleaseDate;
                release.applicationName = $scope.activity.app;
                release.applicationId = AppService.getId();
                if (release.releaseCompletionDate != undefined && release.upcomingReleaseDate != undefined) {
                    console.log(commonService.requestMaker((baseURL + "releasecalendar"), "POST", release));
                }
                release = {};
                var dr = {};
                globalData.DRs.push({
                    completiondate: $scope.activity.rcCompletionDate,
                    planneddate: $scope.activity.rcPlannedDate,
                    app: $scope.activity.app
                });
                dr.drCompletionDate = $scope.activity.rcCompletionDate;
                dr.upcomingDRDate = $scope.activity.rcPlannedDate;
                dr.applicationName = $scope.activity.app;
                dr.applicationId = AppService.getId();
                if (dr.drCompletionDate != undefined && dr.upcomingDRDate != undefined) {
                    console.log(commonService.requestMaker((baseURL + "drcalendar"), "POST", dr));
                }
                dr = {};
            } else if (document.location.hash == "#/AppreciationsAndChallenges") {
                $scope.activity.module = "ac";
                $scope.showSimpleToast("Appreciation/Challenge has been added successfully!");
                $rootScope.itemCount[3]++;
                $rootScope.toppings[3].wanted = true;
                var appreciation = {};
                globalData.appreciations.push({
                    app: $scope.activity.app,
                    appreciation: $scope.activity.appreciation
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
                    app: $scope.activity.app,
                    issue: $scope.activity.issue
                });
                challenge.applicationName = $scope.activity.app;
                challenge.applicationId = AppService.getId();
                challenge.issue = $scope.activity.issue;
                if (challenge.issue != undefined) {
                    console.log(commonService.requestMaker((baseURL + "coresissues"), "POST", challenge));
                }
                challenge = {};
            } else if (document.location.hash == "#/Ideas") {
                $scope.activity.module = "is";
                $scope.showSimpleToast("Idea has been added successfully!");
                $rootScope.itemCount[4]++;
                $rootScope.toppings[4].wanted = true;
                var idea = {};
                globalData.ideas.push({
                    app: $scope.activity.app,
                    state: $scope.activity.ideaState,
                    description: $scope.activity.ideaDescription,
                    benefits: $scope.activity.businessBenefits,
                    plan: $scope.activity.implementationPlan
                });
                idea.applicationName = $scope.activity.app;
                idea.applicationId = AppService.getId();
                idea.ideaState = $scope.activity.ideaState;
                idea.ideaDescription = $scope.activity.ideaDescription;
                idea.businessBenefits = $scope.activity.businessBenefits;
                idea.implamentationPlan = $scope.activity.implementationPlan;
                console.log(commonService.requestMaker((baseURL + "ideas"), "POST", idea));
                idea = {};
            } else if (document.location.hash == "#/Trainings") {
                $scope.activity.module = "tr";
                $scope.showSimpleToast("Training has been added successfully!");
                $rootScope.itemCount[5]++;
                $rootScope.toppings[5].wanted = true;
                var training = {};
                globalData.trainings.push({
                    selectedAssociates: $scope.selectedAssociates,
                    associatename: $scope.activity.selectedAssociates,
                    type: $scope.activity.trainingType,
                    name: $scope.activity.trainingName
                });
                $scope.activity.selectedAssociates = $scope.selectedAssociates;
                training.trainingType = $scope.activity.trainingType;
                training.trainingName = $scope.activity.trainingName;
                for (var f = 0; f < $scope.activity.selectedAssociates.length; f++) {
                    training.empName = $scope.activity.selectedAssociates[f].name;
                    training.empId = $scope.activity.selectedAssociates[f].empid;
                    console.log(commonService.requestMaker((baseURL + "trainings"), "POST", training));
                }
                training = {};
            } else if (document.location.hash == '#/Highlights') {
                $scope.activity.module = 'hi';
                $scope.showSimpleToast("Highlight has been added successfully!");
                $rootScope.toppings[7].wanted = true;
                var highlight = {};
                globalData.highlights.push({
                    week: $scope.activity.weekDay,
                    app: $scope.activity.app,
                    highlight: $scope.activity.highlight
                });
                highlight.week = $scope.activity.weekDay;
                highlight.applicationName = $scope.activity.app;
                highlight.applicationId = AppService.getId();
                highlight.highlights = $scope.activity.highlight;
                console.log(commonService.requestMaker((baseURL + "weeklyhighlights"), "POST", highlight));
                highlight = {};
            } else if (document.location.hash == '#/NonSN') {
                $scope.activity.module = 'sn';
                $scope.showSimpleToast("NON-SN Data has been added successfully!");
                $rootScope.toppings[6].wanted = true;
                var nonsn = {};
                globalData.nonsn.push({
                    week: $scope.activity.snweekDay,
                    app: $scope.activity.app,
                    nonsndata: $scope.activity.nonsndata
                });
                nonsn.week = $scope.activity.snweekDay;
                nonsn.applicationName = $scope.activity.app;
                nonsn.applicationId = AppService.getId();
                nonsn.nonsndata = $scope.activity.nonsndata;
                console.log(commonService.requestMaker((baseURL + "nonsndata"), "POST", nonsn));
                nonsn = {};
            }
            $scope.activities.push(angular.copy($scope.activity));
            console.log($scope.activities);
            DataService.data = $scope.activities;
            $scope.activity = {};
        }
        //variables part end
}).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close().then(function () {
            $log.debug("close LEFT is done");
        });
    };
}).controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close().then(function () {
            $log.debug("close RIGHT is done");
        });
    };
}).controller('ListCtrl', function ($scope, $rootScope, $log, $mdSidenav) {
    $rootScope.toppings = [
        {
            name: 'Month/Qtr Close Activities',
            wanted: false,
            url: $rootScope.hashes[0]
            }
        , {
            name: 'Application Outages',
            wanted: false,
            url: $rootScope.hashes[1]
            }
        , {
            name: 'Release & DR Calender',
            wanted: false,
            url: $rootScope.hashes[2]
            }
        , {
            name: 'Appreciations & Challenges',
            wanted: false,
            url: $rootScope.hashes[3]
            }
        , {
            name: 'Ideas Proposed/Implemented',
            wanted: false,
            url: $rootScope.hashes[4]
            }
        , {
            name: 'Trainings & Certifications',
            wanted: false,
            url: $rootScope.hashes[5]
            }
        , {
            name: "NON-SN Data",
            wanted: false,
            url: $rootScope.hashes[6]
            }
        , {
            name: 'Weekly Highlights',
            wanted: false,
            url: $rootScope.hashes[7]
            }
        , {
            name: 'Leave Calendar',
            wanted: false,
            url: $rootScope.hashes[8]
            }
        , {
            name: 'Reports',
            wanted: false,
            url: $rootScope.hashes[9]
            }
//        , {
//            name: 'Dashboard',
//            wanted: false,
//            url: $rootScope.hashes[10]
//            }
  ];
    $scope.redirector = function (url, name) {
        if (window.location.hash.substring(2) != url.substring(1)) {
            console.log(window.location.hash.substring(2) + "  " + url.substring(1));
            window.location.hash = url;
            $mdSidenav('left').close().then(function () {
                $log.debug("close LEFT is done");
            });
        }
        $rootScope.heading = name;
    }
    $rootScope.heading = "Month/Qtr Close Activities";
}).controller('FrequencyCtrl', function ($scope) {
    $scope.state = 'Monthly';
    $scope.frequencies = ('Monthly Quarterly').split(' ').map(function (state) {
        return {
            abbrev: state
        };
    });
}).controller('OutageRCACtrl', function ($scope) {
    $scope.OutageState = 'Panned';
    $scope.OutageOptions = ('Planned Unplanned').split(' ').map(function (states) {
        return {
            options: states
        };
    });
    $scope.RCAState = 'Yes';
    $scope.RCAOptions = ('Yes No').split(' ').map(function (states) {
        return {
            options: states
        };
    });
}).controller('IdeaCtrl', function ($scope) {
    $scope.state = 'Proposed';
    $scope.frequencies = ('Proposed Implemented').split(' ').map(function (state) {
        return {
            abbrev: state
        };
    });
}).controller('TrainingCtrl', function ($scope) {
    $scope.state = 'Training(Domain)';
    $scope.frequencies = ('Training(Domain) Training(Technical) Certification').split(' ').map(function (state) {
        return {
            abbrev: state
        };
    });
}).controller("customTableCtrl", demoController)
demoController.$inject = ["NgTableParams", "ReportService", "$scope"];

function demoController(NgTableParams, ReportService, $scope) {
    var self = this;
    $scope.reportOptions = ('Completed Defaulters').split(' ').map(function (states) {
        return {
            options: states
        };
    });

    
    $scope.downloadMSR = function(){
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
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            dataset: data
        };
        return new NgTableParams(initialParams, initialSettings);
    }

}
