angular.module('sidenavDemo1').controller('ListCtrl', function ($scope, $rootScope, $log, $mdSidenav) {
    $rootScope.toppings = [
        {
            name: 'Month/Qtr Close Activities'
            , wanted: false
            , url: $rootScope.hashes[0]
            }
        , {
            name: 'Application Outages'
            , wanted: false
            , url: $rootScope.hashes[1]
            }
        , {
            name: 'Release & DR Calender'
            , wanted: false
            , url: $rootScope.hashes[2]
            }
        , {
            name: 'Appreciations & Challenges'
            , wanted: false
            , url: $rootScope.hashes[3]
            }
        , {
            name: 'Ideas Proposed/Implemented'
            , wanted: false
            , url: $rootScope.hashes[4]
            }
        , {
            name: 'Trainings & Certifications'
            , wanted: false
            , url: $rootScope.hashes[5]
            }
        , {
            name: "NON-SN Data"
            , wanted: false
            , url: $rootScope.hashes[6]
            }
        , {
            name: 'Weekly Highlights'
            , wanted: false
            , url: $rootScope.hashes[7]
            }
        , {
            name: 'Leave Calendar'
            , wanted: false
            , url: $rootScope.hashes[8]
            }
        , {
            name: 'Reports'
            , wanted: false
            , url: $rootScope.hashes[9]
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
});