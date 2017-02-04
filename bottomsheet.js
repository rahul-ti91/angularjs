angular.module('bottomSheet', ['ngMaterial', 'sidenavDemo1'])

.controller('BottomSheet', function ($scope, $timeout, $mdBottomSheet) {
        $scope.alert = '';

        $scope.showListBottomSheet = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'bottom-sheet-list-template.html',
                controller: 'ListBottomSheetCtrl'
            }).then(function (clickedItem) {
                $scope.alert = clickedItem['name'] + ' clicked!';
            });
        };
    })
    .controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet, DataService) {

        $scope.items = [];
        for (i = 0; i < DataService.data.length; i++) {
            var data = DataService.data[i];
            console.log(data);
            if (data.module == 'ca' && document.location.hash == "#/ClosingActivity") {
                var item = {
                    name: data.frequency + ' Closing Activity done for ' + data.app + ' on ' + dateFormatter(data.closingDate),
                    description: data.closingDescription
                };
                $scope.items.push(item);
                
            } else if (data.module == 'ao' && document.location.hash == "#/ApplicationOutages") {
                var item = {
                    name: data.aoOutageType + " application Outage for " + data.app + " for " + data.aoDuration + " was started on " + dateFormatter(data.aoDate) + " at " + data.aoStartTime + ", it's RCA done status is " + data.aoRca,
                    description: data.aoOutageReason
                };
                $scope.items.push(item);            
            } else if (data.module == 'rc' && document.location.hash == "#/ReleaseAndDRCalendar") {
                var strCont = "";
                
                if ((data.rcLastReleaseDate != undefined) || (data.rcUpcomingReleaseDate != undefined)) {
                    if (data.rcLastReleaseDate != undefined) {
                        strCont = data.app + " was last released on " + dateFormatter(data.rcLastReleaseDate) + ". ";
                    }
                    if (data.rcUpcomingReleaseDate != undefined) {
                        strCont += data.app + "'s upcoming planned release date is " + dateFormatter(data.rcUpcomingReleaseDate);
                    }
                    var item = {
                        name: strCont,
                        description: ""
                    };
                    $scope.items.push(item);
                    
                    strCont = "";
                }
                if ((data.rcCompletionDate != undefined) || data.rcPlannedDate != undefined) {
                    if (data.rcCompletionDate != undefined) {
                        strCont = data.app + "'s DR was done on " + dateFormatter(data.rcCompletionDate);
                    }
                    if (data.rcPlannedDate != undefined) {
                        strCont += data.app + "'s upcoming planned DR date is " + dateFormatter(data.rcPlannedDate);
                    }
                    var item = {
                        name: strCont,
                        description: ""
                    };
                    $scope.items.push(item);
                    strCont = "";
                }
                console.log($scope.items);
            } else if (data.module == 'ac' && document.location.hash == "#/AppreciationsAndChallenges") {
                if (data.appreciation != undefined) {
                    var item = {
                        name: "Application " + data.app + " has got appreciation mentioned as below:",
                        description: data.appreciation
                    };
                    $scope.items.push(item);
                }
                if (data.issue != undefined) {
                    var item = {
                        name: "Application " + data.app + " has issue mentioned as below:",
                        description: data.issue
                    };
                    $scope.items.push(item);
                    
                }
            } else if (data.module == 'is' && document.location.hash == "#/Ideas") {
                var item = {
                    name: "Idea has been " + data.ideaState + " in application " + data.app,
                    description: data.ideaDescription
                };
                $scope.items.push(item);
                
            } else if (data.module == 'tr' && document.location.hash == "#/Trainings") {
                var associates = "";
                for(f = 0; f< data.selectedAssociates.length; f++){
                    associates += data.selectedAssociates[f].name + ", ";
                }
                var item = {
                    name: "Associate " + associates.substr(0, associates.length-2) + " has successfully completed the " + data.trainingType + "  '" + data.trainingName + "'",
                    description: data.ideaDescription
                };
                $scope.items.push(item);
            }else if(data.module == 'sn' && document.location.hash == '#/NonSN'){
                var item = {
                    name: "NON-SN data of week " + dateFormatter(data.snweekDay, true) + " for Application " + data.app +" has been added",
                    description: data.nonsndata
                };
                 $scope.items.push(item);
            }else if(data.module == 'hi' && document.location.hash == '#/Highlights'){
                 var item = {
                    name: "Weekly Highlight of week " + dateFormatter(data.weekDay, true) + " for Application "+ data.app + " has been added",
                    description: data.highlight
                };
                $scope.items.push(item);
            }
        }



        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            
            $mdBottomSheet.hide(clickedItem);
        };
    
        $scope.deleteItem = function($index){
            //alert($index);
            //$scope.items.splice($index, 1);
            console.log($scope.items);
            console.log(DataService.data);
        }
    });

function dateFormatter(dateString, weekFlag){
    var date = new Date(dateString);
    if(weekFlag != undefined){
        weekdata = date.getDate() + " to " + (date.getDate() + 4) + " " + date.toLocaleString("en-us", { month: "short" }) + " " + date.getFullYear();
        return weekdata;
    }
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}
