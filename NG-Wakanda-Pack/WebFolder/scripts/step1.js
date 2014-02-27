angular.module('step1', ['wakConnectorModule']);

function Controller($scope, wakConnectorService) {

    $scope.loaded = !!wakConnectorService ? 'loaded' : 'not loaded';

}
