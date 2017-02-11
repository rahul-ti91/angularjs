(function () {
    'use strict';
    angular.module('autocompleteDemo', ['ngMaterial', 'commonServiceModule']).controller('DemoCtrl', DemoCtrl).service("AppService", function () {
        var applicationName = "", id = "";
        this.setApplicationName = function(name){applicationName = name;};
        this.getApplicationName = function(){return applicationName;};
        this.setId = function(val){id = val;};
        this.getId = function(){return id;};
    });

    function DemoCtrl($timeout, $q, $log, AppService, commonService, baseURL) {
        var self = this;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states =
        loadAll();
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.newState = newState;

        function newState(state) {
            alert("Sorry! You'll need to create a Constitution for " + state + " first!");
        }
        // ******************************
        // Internal methods
        // ******************************
        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? self.states.filter(createFilterFor(query)) : self.states
                , deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            }
            else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
            if (item != undefined) {
                AppService.setApplicationName(item.display);
                AppService.setId(item.value);
            }
            else {
                AppService.setApplicationName("");
                AppService.setId("");
            }
            //console.log(AppService);
        }
        /**
         * Build `states` list of key/value pairs
         */
        var requestUrl = baseURL + "applications";
        commonService.requestMaker(requestUrl, "GET").then(function (allStates) {
            console.log(allStates);
            var apps = [];
            for (var g = 0; g < allStates.data.length; g++) {
                apps.push({
                    value: allStates.data[g].id
                    , display: allStates.data[g].applicationName
                });
            }
            self.states = apps;
        }, function (res) {
            console.log(res);
            self.states = {
                value: 'error'
                , display: res
            };
        });

        function loadAll() {
            /* var allStates = 'Abs Suite, Aircraft Portfolio, Aml Service, Audit Tracker, Bcps2, Bridger, Business Objects, Clearpar, Clinical Odyssey, Command Center, Dcf, Deal Tracker, Everest, Fas 91, Corelogic, Parcel, Good Faith, Hfs Atlas, Hfs Atlas Cognos Reporting, Hfs Portfolio Certification, Hfs RE Argus Enterprise, Intralinks, Kronos, Kyc, Metreo Vision, Nisa, Onesource, Pricing Data, PTMS, Roll Forward, Sabrix, Salesforce, Sam etl, Smart Deal, Sofun, Static Loss Pool, Synam, Syndtrak4, Taxdb, TOS, TRR, Venture Complete, Wilber, Workflow, Xactly';
             */
            //var allStates = 'Application 1, Application 2, Application 3, Application 4, Application 5, Application 6, Application 7';
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (angular.lowercase(state.display).indexOf(lowercaseQuery) === 0);
            };
        }
    }
})();