angular.module('step5', ['wakConnectorModule']);

function Controller($scope, wakConnectorService) {

    // Create a proxy of the server model
    wakConnectorService.init('Employee').then(function oninit(ds) {
 
        $scope.employees = ds.Employee.$find({});

    });

}
