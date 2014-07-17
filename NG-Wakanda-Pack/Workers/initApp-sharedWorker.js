const
    COUNT_EMPLOYEES_TO_CREATE = 100000,
    ADMIN_PASSWORD = 'admin';

var
    generator;

self.onconnect = function initAppWorkerOnConnect(event) {

    var
        privateSettingsFile;

    ds.setCacheSize(1024 * 1024 * 1024); // 1 Gb


    /**************************************************/
    /*   INIT THE COUNTRY / COMPANY / EMPLOYEE DATA   */
    /**************************************************/

    // if data empty, generate fake data
    //if (ds.Employee.length === 0) {
    	generator = require("fakedata/generator");
    	loginByPassword('admin', ADMIN_PASSWORD);
    	console.info(" ::::: Creating ", COUNT_EMPLOYEES_TO_CREATE, " Employees  Companies...");
    	generator.buildFakeData(COUNT_EMPLOYEES_TO_CREATE, {log: false, remove: true});
    	console.info(" End creating Employees. Employees: ", ds.Employee.length, ", Companies: ", ds.Company.length, ", Country: ", ds.Country.length, " ::::: ");
    	ds.flushCache();
    //}

    // Warm the cache with a sequential query that will load all logs
    console.log('Warming the cache..........');
    try {
    	ds.Employee.query("ID > 0");
    	ds.Company.query("ID > 0");
    	ds.Country.query("ID > 0");
    } catch(err) {
    	// just ignore this error
    	console.warn('query failed:', err);
    }
    console.log('Warming the cache..........done');


    /**************************************************/
    /*            RE-INIT THE TODO DATA               */
    /**************************************************/

    ds.Item.remove();
    [
        {ID: 1, text: 'Try AngularJS', done: true},
        {ID: 2, text: 'Try Angular-Wakanda', done: false},
        {ID: 3, text: 'Play with Wakanda', done: false},
        {ID: 4, text: 'Have Fun!', done: false}
    ].forEach(function addTodo(todo) {
        var item = new ds.Item(todo);
        item.save();
    });

    /**************************************************/
    /*       RE-INIT THE GROUP / CONTACT DATA         */
    /**************************************************/


    var groups;
    ds.Group.remove();
    ds.Contact.remove();
    [
        {ID: 1, name: 'Coworkers'},
        {ID: 2, name: 'Friends'},
        {ID: 3, name: 'Family'},
    ].forEach(function addGroup(group) {
        group = new ds.Group(group);
        group.save();
        groups[group.name] = group;
    });
    [
        {name: 'Cindy',   group: groups.Coworkers, mobile: '+1 234567890'},
        {name: 'Jerry',   group: groups.Coworkers, mobile: '+1 345678901'},
        {name: 'Paul',    group: groups.Friends,   mobile: '+1 456789012'},
        {name: 'Bill',    group: groups.Friends,   mobile: '+1 567890123'},
        {name: 'Hilary',  group: groups.Friends,   mobile: '+1 678901234'},
        {name: 'Cindy',   group: groups.Family,    mobile: '+1 789012345'},
        {name: 'Phillip', group: groups.Family,    mobile: '+1 890123456'}
    ].forEach(function addContact(contact) {
        contact = new ds.Group(contact);
        contact.save();
    });

    console.log('close the initApp shared worker');
    self.close();
};