'use strict';

angular.module('playAngular', ['wakanda'])

// Snippet from Vojta Jina: http://jsfiddle.net/vojtajina/U7Bz9/
.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

function PlayController($scope, $wakanda) {
	$wakanda.init('Country,Company,Employee').then(function oninit(ds) {
	    PlayControllerReady($scope, ds);
	});
}

function PlayControllerReady($scope, ds) {
    
    $scope.countries = ds.Country.$find();

    $scope.$watchCollection('countries[0]', function (country) {
        $scope.country = country;
    });

    $scope.$watch('country', function (country) {
        if (!country) return;
        country.companies.$fetch();
    });
    
    $scope.$watchCollection('country.companies[0]', function (company) {
        $scope.company = company;
    });

    $scope.$watch('company', function (company) {
        if (!company) return;
        company.employees = company.$_entity.employees; // TMP HACK
        if (!company.employees.$fetch) { // TMP HACK
            company.employees = ds.Employee.$find({filter: 'company.ID = ' + company.ID});
            return;
        }
        company.employees.$fetch();
    });

    $scope.$watchCollection('company.employees[0]', function (employee) {
        $scope.employee = employee;
    });

    // Select an entity from a row
    $scope.setCurrent = function setCurrent(name, value) {
        $scope[name] = value;
    };
    
    // Filter
    $scope.setFilters = function setFilters(collection, dataclass, attr, parent, id) {
        var scope, value, filters, options;
        
        scope = parent ? $scope[parent] : $scope;
        value = scope[collection]._nameFilter;
        
        filters = [];
        if (value) {
            filters.push(attr + ' = "' + value + '*"');
        }
        if (parent) {
            filters.push(parent + '.ID = ' + id);
        }

        options = filters.length ? {filter: filters.join(' AND ')} : {};
        scope[collection] = ds[dataclass].$find(options);
        scope[collection]._nameFilter = value;
    };
    
}