// Modules/Model/Country.js
var Country = module.exports = new DataClass('Country', 'Countries');

Country.ID = new Attribute('storage', 'long', 'key auto');

Country.name = new Attribute('storage', 'string');
Country.code = new Attribute('storage', 'string');
Country.companies = new Attribute('relatedEntities', 'Company', 'country', {reversePath: true});
