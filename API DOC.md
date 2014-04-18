
# Angular-Wakanda API Documentation

**BEWARE THIS IS EXPERIMENTAL**

**All this API is experimental. Don't hesitate to create issues to make suggestions.**


All async methods return a promise 

Developers **don't have to call** <code>$scope.$apply</code> when using an async methods of our api. Either it is done transparently, either the $scope is passed as a parameter to the api



## Wakanda Service API

### Initialization

The developer can have an already fulfilled service by adding a resolve function in it's routeProvider.

<pre>
```javascript
// Load all the Data Model
// A promise is returned which callback receive the Wakanda Datastore proxy
$wakanda.init().then(function (ds) {
	// use the datastore 
}); 

// Specify which dataClasses to load
$wakanda.init('Product', 'Person'); 

// Get the datastore object
// throw an exception if init has not been called or the promise hasn't resolved yet. 
// Exception explains steps to configure the service.
$wakanda.getDatastore(); 
```
</pre>


### Inside a controller

All loaded dataclasses are accessible via the Datastore Object delivered by the init Promise callback parameter or the <code>getDataStore()</code> method

<pre>
```javascript
var Product = $wakanda.getDatastore().Product
```
</pre>

### User authentication

**TODO**

<pre>
```javascript
// return a promise
$wakanda.login(user, password);
// return a promise
$wakanda.logout();
```
</pre>

see [Wakanda Directory](http://doc.wakanda.org/home2.en.html#/Directory/Index-of-methods-and-properties.902-814586.en.html)

## DataClass API

### Metadata
<pre>
```javascript
var dataClass = $wakanda.getDatastore().Product
dataClass.$name; // 'Product'
dataClass.$collectionName; // 'ProductCollection'
dataClass.$attr(); // return an array of attributes metadata of the entity
dataClass.$attr('name'); // return the 'name' attribute metadata
dataClass.$entityMethods(); // return all metadatas on all user defined entity methods
dataClass.$entityMethods('myMethod'); // return all user defined entity methods names (array of string)
dataClass.$collectionMethods(); // return all user defined collection methods names (array of string)
dataClass.$dataClassMethods(); // return all user defined dataclass methods names (array of string)
```
</pre>

**TODO**

Metadatas format of attributes is to be defined

### Wakanda User defined Methods

All DataClass level Wakanda User Defined methods are added to the dataClass instance.
They return a promise.

<pre>
```javascript
var dataClass = ds.Product;
dataClass.myMethod().then(function () {});
```
</pre>

#### Syntax (inspired by ngResource)

Like for ngResource, those methods return an empty array, or object, with a $promise property.

<pre>
```javascript
//Direct binding
$scope.people = Person.$find();

$scope.people.length == 0; // Will be populated after async result
$scope.people.$promise; // a promise is provided if needed

// Wait for result before binding (need to transform result for example)
var people = ds.Person.$find({limit: 10}, function() {
	// peoples.length == 10;
	// modify peoples
	$scope.people = people;
});

// Can bind straight away but need to be notified after load done 
$scope.spinnerActive = true;
$scope.people = ds.Person.$find({limit: 10}, function() {
	$scope.spinnerActive = false;
});
```
</pre>

### Framework methods and properties

They are prefixed by $ to avoid name collision with user defined methods

#### $find()

<pre>
```javascript
var products = ds.Product.$find({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```
</pre>

The returned value (products in the above example) is an EntityCollection.

See supra (ngResource syntax) for full syntax ($promise and callback)

#### $findOne()

Returns an object

<pre>
```javascript
var product = ds.Product.$findOne(id);
```
</pre>

See supra (ngResource syntax) for full syntax ($promise and callback)

#### $distinctValues()

Returns an entityCollection or just an array ? **(TO BE DEFINED)**

<pre>
```javascript
var categories = ds.Product.$distinctValues('category');
```
</pre>

#### $create()

Created entities:

* have angular-wakanda methods (<code>$save()</code>, <code>$remove()</code>)
* have Wakanda User Defined entity methods
* are not sync with the server until the developer call <code>$save()</code> (no automatique save)

<pre>
```javascript
var newProduct = ds.Product.$create({
  name: 'a product name'
});
newProduct.aUserDefinedMethod();
newProduct.$save();
```
</pre>

## EntityCollection API

Is an array.
Provide access to individual entities:

<pre>
```javascript
var firstProduct = products[0];

$scope.myProduct = products[10];
```
</pre>

### User defined methods

All Collection level Wakanda User defined methods are available on the entity collection. They return a promise.

<pre>
```javascript
products.myCollectionMethod().then(function() {});
```
</pre>

### Framework methods and properties

They are prefixed by $ to avoid name collision with user defined methods

#### $totalCount

An integer property indicating the total count of all entities in the entity collection.
This property correspond to the length property of the entity collection.
When doing a fetch, if the `$totalCount` has changed, the property value is updated.

#### $entitysetId

Contains the entityset id internally used to execute `$fetch()` calls

### $fetching

A boolean at true if the entity collection is currently fetching data.
Is set to false after the http response (even if we get an error).
Is set to true when the entity collection is first created with `ds.Entity.$find()`

Can be used to show a spinner

### $fetch()

Retrieve entities from the server in the same entityset

<pre>
```javascript
products.$fetch({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```
</pre>

`$fetch()` modify the array of the current entity collection (`products` here)

<pre>
```javascript
products.$fetch({
	start: 0,
	pageSize: 50
}); // products will be modified
```
</pre>

Without parameters, the `$fetch()` refresh the data with the `$query.start` and `$query.pageSize` current values

<pre>
```javascript
products.$fetch(); 
```</pre>

`$fetch()` returns a promise.

<pre>
```javascript
products.$fetch({
	start: 0,
	pageSize: 50
}).then(function() {});
```
</pre>

So the developer *doesn't have to write* code like this :

<pre>
```javascript
$scope.products.$fetch(start, pageSize).then(function(products) {
  $scope.products = products;
});
```
</pre>


#### $find()

Retrieve entities from the server in the same entityset using the same api as $find on dataclass.

<pre>
```javascript
var filteredProducts = products.$find({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```
</pre>

Unlike `$fetch()`, `$find()` do not modify the array of the current entity collection (products here) but return a new entity collection. This functionality is usefull for related entities if you want to have multiple display of them.

#### $query

Contains the state of the initial fetch parameters.
<pre>
```javascript
products.$query.pageSize;
products.$query.start;
products.$query.filter;
```
</pre>

This is usefull in order to code the sugars.

#### Additionnal sugar methods

TODO 

* $nextPage();
* $prevPage();
* $gotoPage();
* $more();


## Entity API

Entities are simple pojos :

<pre>
```javascript
firstProduct.name; // attributes values;
firstProduct.fullName; // calculated attributes values;
```
</pre>

### User defined methods

All Entity level Wakanda User defined methods are available on the entity. They return a promise.

<pre>
```javascript
product.myEntityMethod().then(function() {}); // entity method
```
</pre>

### Client side validation

**TO BE DONE**
### Special Images and blob attributes


#### src

Images and blob urls are available their a `src` attribute.

<pre>
```javascript
employee.largePhoto.src === '/rest/employee(123)/largePhoto/...'
```
</pre>

#### $upload(file)

The image or blob attribute have a $upload() method to upload file.
This method expects a window.File parameter. It returns a promise.

Here some pseudo-code of this function:

<pre>
```javascript
employee.largePhoto.$upload(img);
```
</pre>

**Usage code**

For an input like this : 

<pre>
```html
&lt;input type="file" id="fileToUpload" /&gt;
```
</pre>

<pre>
```javascript
var file = document.getElementById('fileToUpload').files[0];
employee.photo.$upload(file).then(…);
```
</pre>


### Framework methods and properties

They are prefixed by $ to avoid name collision with user defined methods


#### $save()

Save an entity on the server. This method return a promise

<pre>
```javascript
product.$save().then(function() {});
```
</pre>

If the server version of the entity is different from the original changed entity, it must be updated and changes notifications are then triggered.


##### Link to another entity

The value of a relation attribute can be set by assigning a saved entity to it. 

Example :
<pre>
```javascript
var productCategory = ds.Category.$create({name: 'fruit'});
productCategory.$save().then(function() {
	firstProduct.category = productCategory;
	firstProduct.$save();
});
```
</pre>

If the related entity is new and not saved, the `$save()` method of the parent entity (firstProduct here) throws an error.

Only NgWakEntity object are  accepted, not pojos.
The modifications are checked when the `$save()` method of the parent entity is called (comparison between related entity in WAFEntity and NgWakEntity). 



### $fetch()

Equivalent of the [Wakanda Framework `serverRefresh()` method](http://doc.wakanda.org/Datasource/Datasources/serverRefresh.301-607702.en.html) with `forceReload=true` on entities

Is mostly used for deferred loading

#### $fetch() on deferred objects

When a related attributes is not expanded in the initial query, the user must fetch it.

<pre>
```javascript
var person = persons[0];
// person.company.name === undefined;
person.company.$fetch().then(function() {
  // person.company.name === '4D'
});
```
</pre>

By default, the related entity collection (staff below) is an empty `NgWakCollection`. The `$fetch()` method is the standard entity collections one.

<pre>
```javascript
var company = companies[0];
company.staff.length == 0;
company.staff.$fetch().then(function() {
  company.staff.length == 40;
});
```
</pre>

If the developer has selected staff in the companies initial query, the `NgWakCollection` will not be empty even if it's not correlated with an entityset server side.

When the developer call `$fetch()` on companies, the entityset will be created.

**TODO **

user must be able to specify which attributes to select

think about a $dirty or $dirty() feature ($dirty is done with watch, optimised for high read/write, $dirty() is done with diff, optimised for high write/read)


### $serverCompute()

Equivalent of the [Wakanda Framework `serverRefresh()` method](http://doc.wakanda.org/Datasource/Datasources/serverRefresh.301-607702.en.html) with `forceReload=false` on entities

<pre>
```javascript
var firstProduct = products[0];
firstProduct.name = 'New name';
firstProduct.$serverCompute();
```
</pre>

### $remove()

<pre>
```javascript
var firstProduct = products[0];
firstProduct.$remove();

firstProduct.$remove().then(function() {});
```
</pre>

firstProduct should not be removed from the products array, the developer must do it manually.



## API Architecture

`NgWakEntity` class have all framework methods on it's prototype :

* $save
* $serverRefresh
* $remove
* ...

`NgWakCollection` class have all framework methods on it's prototype :

* $fetch
* ...

`NgWakCollection` extends `Array`

Based on the catalog and dataclass metadatas, for each dataclass, `{EntityName}Entity` and `{EntityName}Collection` classes are generated.

* They have all user defined methods on their prototype
* They extends the `NgWakEntity` and `NgWakCollection` prototypes using a strict inheritance. `{EntityName}Entity` has a `__proto__` property pointing to `NgWakEntity.prototype`, we do not copy the NgWakEntity.prototype methods to the `{EntityName}Entity` prototype. 
* They must have a $dataClass property pointing to wakandaService.getDatastore()[{EntityName}]

### Public exposure of prototypes

In order to allow the developer to customize it's entity (override framework methods for all entities or only for a specific one or add client side methods), all prototypes are exposed.

The generic one :
<pre>
```javascript
ds.$Entity === NgWafEntity
ds.$Collection === NgWakCollection
```
</pre>

And the dataclass derived ones :
<pre>
```javascript
ds.Product.$Entity = {EntityName}Entity
ds.Product.$Collection = {EntityName}Collection
```
</pre>

**All pojos returned by the API extend `{EntityName}Entity` or `{EntityName}Collection`**

A pojo have a pointer to it's prototype via the `$Entity` property :

<pre>
```javascript
employeePojo.$Entity === ds.Employee.$Entity
employeeCollectionPojo.$Collection === ds.Employee.$Collection
```
</pre>

This include nested pojos (company of a person for example). This impact for example `$find()`, `$fetch()`, `$findOne()` and `$create()` methods that scan recursively their pojos.

One can write :
<pre>
```javascript
me.company.$save();
me.company.companyUserDefinedMethod();
me.$save();
me.personUserDefinedMEthod();
```
</pre>

### Global cache

There is no global cache that garanty that all same entities are stored only once in memory.
It is planned to use [ECMAScript 6 Weakmap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

### NgWakEntity creation from WAFEntity

There will be a method (private ?) to convert `WAFEntity` instances to `NgWakEntity` instances.
This will be used for deserialization of entity collection.

