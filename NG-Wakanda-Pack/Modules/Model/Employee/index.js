// Modules/Model/Employee/index.js
var Employee = module.exports = new DataClass('Employee', 'Employees');

Employee.ID = new Attribute('storage', 'long', 'key auto');

Employee.firstName = new Attribute('storage', 'string');
Employee.lastName = new Attribute('storage', 'string');
Employee.fullName = require('./fullName'); // calculated attribute defined in its own module
Employee.birthDate = new Attribute('storage', 'date');
Employee.age = require('./age'); // calculated attribute defined in its own module
Employee.company = new Attribute('relatedEntity', 'Company', 'Company');
Employee.companyName = new Attribute('alias', 'string', 'company.name');
Employee.manager = new Attribute('relatedEntity', 'Employee', 'Employee');
Employee.staff = new Attribute('relatedEntities', 'Employee', 'manager', {reversePath: true});
Employee.country = new Attribute('alias', 'string', 'company.countryName');
Employee.salary = new Attribute('storage', 'number');
Employee.managedCompanies = new Attribute('relatedEntities', 'Company', 'manager', {reversePath: true});
Employee.title = new Attribute('storage', 'string');
Employee.gender = new Attribute('storage', 'string');
Employee.photo = new Attribute('storage', 'image');