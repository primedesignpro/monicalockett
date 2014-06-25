// Modules/Model/Company.js
var Company = module.exports = new DataClass('Company', 'Companies');


Company.ID = new Attribute('storage', 'long', 'key auto');

Company.name = new Attribute('storage', 'string');
Company.country = new Attribute('relatedEntity', 'Country', 'Country');
Company.countryName = new Attribute('alias', 'string', 'country.name');
Company.employees = new Attribute('relatedEntities', 'Employee', 'company', {reversePath: true});
Company.manager = new Attribute('relatedEntity', 'Employee', 'Employee');
Company.managerName = new Attribute('alias', 'string', 'manager.fullName');
