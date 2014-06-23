'use strict';

angular.module('playAngular', ['wakConnectorModule']);


function PlayController($scope, wakConnectorService) {
	wakConnectorService.init('Country,Company,Employee').then(function oninit(ds) {
	    PlayControllerReady($scope, ds);
	});
}

function PlayControllerReady($scope, ds) {
    
	var ds, relation, parent, collection, current, filter;


	relation = {Country: 'Company', Company: 'Employee'};
	parent = {Employee: 'Company', Company: 'Country'};
	collection = {Company: 'companies', Employee: 'employees'};
	current = {};
	filter = {};

    $scope.current = current;
    $scope.filter = filter;
    $scope.relationLoader = {Country: loadCountries, Company: loadCompanies, Employee: loadEmployees};

    $scope.switchCurrentEntity = function switchCurrentEntity(source, current) {
        if ($scope.current[source]) {
            $scope.current[source].selected = false;
        }
        $scope.current[source] = current;
        if (current) {
            current.selected = true;
        }
        // autoload related entities
        if (source in relation) {
            if (current) {
                $scope.relationLoader[relation[source]](current);
            } else {
               $scope[collection[relation[source]]] = [];
               $scope.switchCurrentEntity(relation[source], null);
            }
        }
    }
    
    $scope.setFilter = function filter(source) {
        $scope.relationLoader[source](
            $scope.current[parent[source]],
            $scope.filter[source]
        );
    };
    
    function formatFilter(filter, current, currentName) {
        var name = currentName === 'company' ? 'fullName' : 'name';
        filter = filter ? [name + ' = "' + filter + '*"'] : [];
        if (current) {
            filter.push(currentName + '.ID = ' + current.ID);
        }
        return {filter: filter.join(' AND ')};
    }
    /*
    $scope.watch('countries', function (countries) {
        filter.Country = '';
        current.country = countries[0];
        current.country.companies.$fetch();
    });
    
    $scope.watch('companies', function (companies) {
        filter.Company = '';
        current.company = companies[0];
        current.company.employees.$fetch();
    });

    $scope.watch('employees', function (employees) {
        filter.Employee = '';
        current.employee = employees[0];
    });
*/
    function loadCountries(ignore, filter) {
        filter = formatFilter(filter);
        $scope.countries = ds.Country.$find(filter);
        $scope.countries.$promise.then(function(event) {
            $scope.switchCurrentEntity('Country', event.result[0]);
        });
    }
    
    function loadCompanies(country, filter) {
        filter = formatFilter(filter, country, 'country');
        $scope.companies = ds.Company.$find(filter);
        $scope.companies.$promise.then(function(event) {
            $scope.switchCurrentEntity('Company', event.result[0]);
        });
    }
    
    function loadEmployees(company, filter) {
        filter = formatFilter(filter, company, 'company');
        $scope.employees = ds.Employee.$find(filter);
        $scope.employees.$promise.then(function(event) {
            $scope.switchCurrentEntity('Employee', event.result[0]);
        });
    }



    loadCountries();
    
}