angular.module('step4', ['wakanda']);

function Controller($scope, $wakanda) {

    // Create a proxy of the server model
    $wakanda.init().then(function oninit(ds) {

        // feed the angular scope with the stored data of the Country DataClass
        $scope.countries = ds.Country.$find();
        
        // manage when a country is choosen
        $scope.$watch('country', function fetchRelatedCompanies(country) {
            if (!country) return;
            // get companies related to current country
            country.companies.$fetch();

        });

        
        // hack to get alias attribute available
        $scope.$watch('company', function fetchShowCompany(company) {
            if (!company) return;
            if (company.managerName) return;
            console.warn('the alias "managerName" attribute is missing:', company);
            console.log('manually add the managerName value from internal properties');
            company.managerName = company.$_entity.managerName.value;
        });
        

    });

}
