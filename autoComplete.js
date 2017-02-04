(function () {
    'use strict';
    angular
        .module('autocompleteDemo', ['ngMaterial'])
        .controller('DemoCtrl', DemoCtrl)
        .service("AppService", function () {
            this.applicationName = "";
        });

    function DemoCtrl($timeout, $q, $log, $mdSidenav, AppService) {
        var self = this;

        self.simulateQuery = false;
        self.isDisabled = false;

        // list of `state` value/display objects
        self.states = loadAll();
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
            var results = query ? self.states.filter(createFilterFor(query)) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
            AppService.applicationName = item.display;
             $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        }

        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
           /* var allStates = 'Abs Suite, Aircraft Portfolio, Aml Service, Audit Tracker, Bcps2, Bridger, Business Objects, Clearpar, Clinical Odyssey, Command Center, Dcf, Deal Tracker, Everest, Fas 91, Corelogic, Parcel, Good Faith, Hfs Atlas, Hfs Atlas Cognos Reporting, Hfs Portfolio Certification, Hfs RE Argus Enterprise, Intralinks, Kronos, Kyc, Metreo Vision, Nisa, Onesource, Pricing Data, PTMS, Roll Forward, Sabrix, Salesforce, Sam etl, Smart Deal, Sofun, Static Loss Pool, Synam, Syndtrak4, Taxdb, TOS, TRR, Venture Complete, Wilber, Workflow, Xactly';
*/
            
            var allStates = 'Application 1, Application 2, Application 3, Application 4, Application 5, Application 6, Application 7';
                
            return allStates.split(/, +/g).map(function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }
    }
})();
