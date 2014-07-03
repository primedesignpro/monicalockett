// Modules/Model/Country.js

var Country = module.exports = new DataClass('Countries');

Country.ID = new Attribute('storage', 'number', 'key auto');

Country.name = new Attribute('storage', 'string');
Country.code = new Attribute('storage', 'string');
Country.companies = new Attribute('relatedEntities', 'Companies', 'country', {reversePath: true});