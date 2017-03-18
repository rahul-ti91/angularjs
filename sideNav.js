angular.module('sidenavDemo1', ['ngMaterial', 'autocompleteDemo', 'ngTable', 'commonServiceModule']).service("DataService", function () {
    this.data = [];
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
});