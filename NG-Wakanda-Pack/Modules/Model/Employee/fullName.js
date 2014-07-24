// Modules/Model/Employee/fullName.js
var fullName = module.exports = new Attribute('calculated', 'string');

fullName.onGet = function Employee_age_onGet() {
    var
        result;

    result = this.firstName ? [this.firstName] : [];
    if (this.lastName) {
        result.push(this.lastName);
    }
    return result.join(' ');
};


fullName.onSet = function Employee_age_onSet() {
	// Add your code here;
	throw new Error('not implemented');
};


fullName.onSort = function Employee_age_onSort() {
    return (ascending ? "firstName, lastName" : "firstName desc, lastName desc");
};


fullName.onQuery = function Employee_age_onQuery(operator, value) {
    return [
        "firstName", operator, value, 
        "||",
        "lastName ", operator, value
    ].join(' ');
}; 

