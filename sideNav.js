angular
    .module('sidenavDemo1', ['ngMaterial', 'autocompleteDemo', 'ngTable'])
    .service("DataService", function () {
        this.data = [];
    })
    .service("ReportService", function(){
    this.getReportData = function(reportType){
        if(reportType == "completionStatus"){
            return [{
        application: "Application 1",
        module: "Leaves",
        month:"October",
        completed:100
    },{
        application: "Application 2",
        module: "MSR",
        month:"October",
        completed:50
    },{
        application: "Application 3",
        module: "MSR",
        month:"October",
        completed:45
    },{
        application: "Application 4",
        module: "Leaves",
        month:"October",
        completed:80
    },{
        application: "Application 5",
        module: "Highlights",
        month:"October",
        completed:100
    },{
        application: "Application 6",
        module: "Leaves",
        month:"October",
        completed:0
    },{
        application: "Application 7",
        module: "Highlights",
        month:"October",
        completed:11
    },{
        application: "Application 8",
        module: "Highlights",
        month:"October",
        completed:65
    },{
        application: "Application 9",
        module: "NON-SN Data",
        month:"October",
        completed:65
    },{
        application: "Application 10",
        module: "MSR",
        month:"October",
        completed:65
    }];
        }
    }
    })
    .controller('AppCtrl', function ($scope, $timeout, $rootScope, $mdSidenav,$q, $log, $rootScope, $mdToast, AppService, DataService) {
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
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
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
      return { name: chip, type: 'new' }
    }

    /**
     * Search for vegetables.
     */
    function querySearch (query) {
      var results = query ? self.associates.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(associate) {
        return (associate._lowername.indexOf(lowercaseQuery) === 0) ||
            (associate._lowertype.indexOf(lowercaseQuery) === 0);
      };

    }

    function loadAssociates() {
      var associates = [
        {
          'name': 'Rahul Tiwari',
          'empid': '5735935'
        },
        {
          'name': 'Umesh Mishra',
          'empid': '593928'
        },
        {
          'name': 'Uma Shah',
          'empid': '49847'
        },
        {
          'name': 'Anshul Kewat',
          'empid': '907878'
        },
        {
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
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                //.position("top right")
                .hideDelay(1500)
            );
        };

        $rootScope.itemCount = [0, 0, 0, 0, 0, 0];
        $scope.addItem = function () {
            $scope.activity.app = AppService.applicationName;

            if ($scope.activity.app.length == 0) {
                $scope.showSimpleToast("Please Select Application");
                return;
            }

            if (document.location.hash == "#/ClosingActivity") {
                $scope.activity.module = "ca";
                $scope.showSimpleToast("Activity has been added successfully!");
                $rootScope.itemCount[0]++;
                $rootScope.toppings[0].wanted = true;
                var closing = {};
                closing.frequency = $scope.activity.frequency;
                closing.app = $scope.activity.app;
                closing.closingdate = $scope.activity.closingDate;
                closing.description = $scope.activity.closingDescription;
                globalData.closings.push(closing);
                closing = {};


            } else if (document.location.hash == "#/ApplicationOutages") {
                $scope.activity.module = "ao";
                $scope.showSimpleToast("Outage has been added successfully!");
                $rootScope.itemCount[1]++;
                $rootScope.toppings[1].wanted = true;
                var outage = {};
                outage.outageType = $scope.activity.aoOutageType;
                outage.app = $scope.activity.app;
                outage.duration = $scope.activity.aoDuration;
                outage.date = $scope.activity.aoDate;
                outage.starttime = $scope.activity.aoStartTime;
                outage.rca = $scope.activity.aoRca;
                outage.reason = $scope.activity.aoOutageReason;
                globalData.outages.push(outage);
                outage = {};

            } else if (document.location.hash == "#/ReleaseAndDRCalendar") {
                $scope.activity.module = "rc";
                $scope.showSimpleToast("Relese/DR Calendar has been added successfully!");
                $rootScope.itemCount[2]++;
                $rootScope.toppings[2].wanted = true;
                var release = {};
                release.lastreleasedate = $scope.activity.rcLastReleaseDate;
                release.upcomingreleasedate = $scope.activity.rcUpcomingReleaseDate;
                release.app = $scope.activity.app;
                globalData.releases.push(release);
                release = {};
                var dr = {};
                dr.completiondate = $scope.activity.rcCompletionDate;
                dr.planneddate = $scope.activity.rcPlannedDate;
                dr.app = $scope.activity.app;
                globalData.DRs.push(dr);
                dr = {};
            } else if (document.location.hash == "#/AppreciationsAndChallenges") {
                $scope.activity.module = "ac";
                $scope.showSimpleToast("Appreciation/Challenge has been added successfully!");
                $rootScope.itemCount[3]++;
                $rootScope.toppings[3].wanted = true;
                var appreciation = {};
                appreciation.app = $scope.activity.app
                appreciation.appreciation = $scope.activity.appreciation;
                globalData.appreciations.push(appreciation);
                appreciation = {};
                var challenge = {};
                challenge.app = $scope.activity.app
                challenge.issue = $scope.activity.issue;
                globalData.challenges.push(challenge);
                challenge = {};
            } else if (document.location.hash == "#/Ideas") {
                $scope.activity.module = "is";
                $scope.showSimpleToast("Idea has been added successfully!");
                $rootScope.itemCount[4]++;
                $rootScope.toppings[4].wanted = true;
                var idea = {};
                idea.app = $scope.activity.app;
                idea.state = $scope.activity.ideaState;
                idea.description = $scope.activity.ideaDescription;
                idea.benefits = $scope.activity.businessBenefits;
                idea.plan = $scope.activity.implementationPlan;
                globalData.ideas.push(idea);
                idea = {};
            } else if (document.location.hash == "#/Trainings") {
                $scope.activity.module = "tr";
                $scope.showSimpleToast("Training has been added successfully!");
                $rootScope.itemCount[5]++;
                $rootScope.toppings[5].wanted = true;
                var training = {};
                $scope.activity.selectedAssociates = $scope.selectedAssociates;
                training.associatename = $scope.activity.selectedAssociates;
                training.type = $scope.activity.trainingType;
                training.name = $scope.activity.trainingName;
                globalData.trainings.push(training);
                training = {};
            } else if (document.location.hash == '#/Highlights') {
                $scope.activity.module = 'hi';
                $scope.showSimpleToast("Highlight has been added successfully!");
                $rootScope.toppings[7].wanted = true;
                var highlight = {};
                highlight.week = $scope.activity.weekDay;
                highlight.app = $scope.activity.app;
                highlight.highlight = $scope.activity.highlight;
                globalData.highlights.push(highlight);
                highlight = {};
            }else if(document.location.hash == '#/NonSN'){
                $scope.activity.module = 'sn';
                $scope.showSimpleToast("NON-SN Data has been added successfully!");
                $rootScope.toppings[7].wanted = true;
                var nonsn = {};
                nonsn.week = $scope.activity.snweekDay;
                nonsn.app = $scope.activity.app;
                nonsn.nonsndata = $scope.activity.nonsndata;
                globalData.nonsn.push(nonsn);
                nonsn = {};
            }

            $scope.activities.push(angular.copy($scope.activity));
            console.log($scope.activities);
            DataService.data = $scope.activities;
            $scope.activity = {};
        }


        //variables part end

    })
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    })
    .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    })
    .controller('ListCtrl', function ($scope, $rootScope, $mdSidenav) {
        $rootScope.toppings = [
            {
                name: 'Month/Qtr Close Activities',
                wanted: false,
                url: $rootScope.hashes[0]
            },
            {
                name: 'Application Outages',
                wanted: false,
                url: $rootScope.hashes[1]
            },
            {
                name: 'Release & DR Calender',
                wanted: false,
                url: $rootScope.hashes[2]
            },
            {
                name: 'Appreciations & Challenges',
                wanted: false,
                url: $rootScope.hashes[3]
            },
            {
                name: 'Ideas Proposed/Implemented',
                wanted: false,
                url: $rootScope.hashes[4]
            },
            {
                name: 'Trainings & Certifications',
                wanted: false,
                url: $rootScope.hashes[5]
            },
            {
             name: "NON-SN Data",
                wanted:false,
                url:$rootScope.hashes[6]
            },
            {
                name: 'Weekly Highlights',
                wanted: false,
                url: $rootScope.hashes[7]
            },
            {
                name: 'Leave Calendar',
                wanted: false,
                url: $rootScope.hashes[8]
            },
            {
                name: 'Reports',
                wanted: false,
                url: $rootScope.hashes[9]
            },
            {
                name: 'Dashboard',
                wanted: false,
                url: $rootScope.hashes[10]
            }
  ];
        $scope.redirector = function (url, name) {
            if (window.location.hash.substring(2) != url.substring(1)) {
                console.log(window.location.hash.substring(2) + "  " + url.substring(1));
                window.location.hash = url;
                $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
            }
            $rootScope.heading = name;
        }
        $rootScope.heading = "Month/Qtr Close Activities";
    })
    .controller('FrequencyCtrl', function ($scope) {
        $scope.state = 'Monthly';
        $scope.frequencies = ('Monthly Quarterly').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });
    })
    .controller('OutageRCACtrl', function ($scope) {
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
    })

.controller('IdeaCtrl', function ($scope) {
        $scope.state = 'Proposed';
        $scope.frequencies = ('Proposed Implemented').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });
    })
    .controller('TrainingCtrl', function ($scope) {
        $scope.state = 'Training(Domain)';
        $scope.frequencies = ('Training(Domain) Training(Technical) Certification').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });
    })
.controller("customTableCtrl", demoController)

demoController.$inject = ["NgTableParams", "ReportService"];

function demoController(NgTableParams, ReportService) {
    var self = this;
    var data = ReportService.getReportData("completionStatus");
   
    //self.tableParams = new NgTableParams({}, {
    //    dataset: data
    //});
    
     self.customConfigParams = createUsingFullOptions();

    function createUsingFullOptions() {
      var initialParams = {
        count: 9 // initial page size
      };
      var initialSettings = {
        // page size buttons (right set of buttons in demo)
        counts: [],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: data
      };
      return new NgTableParams(initialParams, initialSettings);
    }
}
