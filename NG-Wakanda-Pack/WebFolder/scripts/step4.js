angular.module('step4', ['wakConnectorModule']);

function Controller($scope, wakConnectorService) {

    // Create a proxy of the server model
    wakConnectorService.init().then(function oninit(ds) {

        // feed the angular scope with the stored data of the Country DataClass
        $scope.countries = ds.Country.$find({});
        
        // manage when a country is choosen
        $scope.$watch('country', function fetchRelatedCompanies(country) {
            if (!country) return;
            // get companies related to current country

            // code expected to work with version 0.0.9
            $scope.companies = ds.Company.$find({filter: 'country.ID = ' + country.ID});

            // code expected to work with final API
            //country.companies.$fetch();

        });

        // hack to get alias attribute available
        $scope.$watch('company', function fetchShowCompany(company) {
            if (!company) return;
            company.managerName = company.$_entity.managerName.value;
            console.log(company);
        });

    });

}
