// Modules/Model/Employee/age.js
var age = module.exports = new Attribute('calculated', 'string');

const
    MS_BY_YEAR = 31557600000; // 1000 (ms) * 60 (s) * 60 (mn) * 24 (h) * 365.25 (d) -> year

age.onGet = function() {
    var
        today,
        interval,
        nbYears,
        age;

    if (this.birthDate === null) {
        age = null;
    } else {
        today = new Date();
        interval = today - this.birthDate;
        nbYears = Math.floor(interval / MS_BY_YEAR);
        age = nbYears;
    }

    return age;
};


age.onSort = function() {
    return (ascending ? "birthDate desc" : "birthDate");
};


age.onQuery = function(compOperator, valueToCompare) {
    var
        not,
        birthYearFromAgePlusOne,
        lowerlimit,
        upperlimit,
        result;

    if (age === null) {

        not = ['is', 'eq', '=', '==', '==='].indexOf(operator) > -1 ? '' : ' not';
        result = 'birthDate is' + not + ' null';

    } else {

        upperlimit = new Date();
        birthYearFromAgePlusOne = upperlimit.getFullYear() - age;
        upperlimit.setFullYear(birthYearFromAgePlusOne);

        lowerlimit = new Date();
        lowerlimit.setFullYear(birthYearFromAgePlusOne - 1);

        switch (operator) {

        case 'is not':
        case 'neq':
        case '!=':
        case '!==':
            not = true;
            // don't break
        case 'is':
        case 'eq':
        case '=':
        case '==':
        case '===':
            result = "birthDate >= '" + lowerlimit.toISOString() + "'";
            result += " and birthDate < '" + upperlimit.toISOString() + "'";
            result = not ? ("not (" + result + ")") : result;
            break;

        case 'gt':
        case '>':
            result = "birthDate < '" + lowerlimit.toISOString() + "'";
            break;

        case 'gte':
        case '>=':
            result = "birthDate <= '" + upperlimit.toISOString() + "'";
            break;

        case 'lt':
        case '<':
            result = "birthDate > '" + upperlimit.toISOString() + "'";
            break;

        case 'lte':
        case '<=':
            result = "birthDate >= '" + lowerlimit.toISOString() + "'";
            break;

        default:
            console.warn('unknown operator:', operator);
            result = null;

        }
    }

    return result;
};