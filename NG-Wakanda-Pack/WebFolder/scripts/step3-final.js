angular.module('step3', ['wakConnectorModule']);

function Controller($scope, wakConnectorService) {

    // Create a proxy of the server model
    wakConnectorService.init().then(function (ds) {
 
        // once ready use the datastore on the $scope
        // feed the angular scope 
        // with the stored data of the Country DataClass
        $scope.countries = ds.Country.$find();
    });

}