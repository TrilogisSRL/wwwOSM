wwwOSM
-------

The project aims to integrate geographic information data provided by **OpenStreetMap(OSM)** with **Nasa Web World Wind virtual globe**. The outcome allows the users to access the information currently available in the World Wind environment and the data provided by the bigger collaborative project in the world of geographic data.

**wwwOSM (Web World Wind - OpenStreetMap)** is made available as a web application and compatible with all the devices, both desktop and mobile, which satisfy the compatibility requirements.

The project is composed by the front-end/client side, which allows the users to handle geographic information, and the back-end/server side, which deals with the management and maintenance of OSM data, and provide the services for data visualization.

Prerequisites
-------

Environment

* Node.js 
* PostgreSQL 
* Postgis extension 
* A database called `gis`

Node.js modules required:

* node-simple-router,`npm install node-simple-router` 
* node postgres, `npm install pg`

Configuration
-------

Geodata is stored in a local database. The credential have be set in the file `backend/www-osm/db/db.js`  and `backend/www-osm_import-utility/db/db.js`.
The fields to fill are:

```
/**
 * Username for the database connection
 * @type {string}
 */
var username = "<username>";

/**
 * Password for the database connection
 * @type {string}
 */
var password = "<password>";

/**
 * Name of the database
 * @type {string}
 */
var database = "<database>";

/**
 * Address of the database
 * @type {string}
 */
var address = "<address>";
```

The database schema can be found at `db/database_schema.html`.

Run
-------

* Install Node
* Run `run.sh`
* APIs are available at `http://wwwosm.trilogis.it/api/`

Import OSM Data
-------

The OSM data can be import using tool available at `frontend/import.html` 
[Demo on wwwosm.trilogis.it/import.html].

Import is applyed selecting an existence source or creating a new one. The creation of a new source requires:

* the URL of the file
* the name of the file

The Import process is perfomed using the osm2pgsql tool (provided by OpenStreetMap) for the raw import of the geometries, and then a custom tool for the data organization. 

The latest tool performs the following operation:

* insert or update the records avoiding duplicates
* organize the names of the geometries in order to improve the search performances
* assign a LOD and a category to each geometry

Style Customization
-------

The styles can be customized using the web tool located at `frontend/styles.html`.

Further information can be found at [our website](http://www.trilogis.it/wwwosm)


Data view
-------

The data view interface is available at `frontend/index.html` 
[Demo on wwwosm.trilogis.it]


Credits
-------

Author: Gustavo German Soria ([Trilogis Srl](http://www.trilogis.it))

* WebWorldWind is an opensource API relased by [NASA](http://www.nasa.gov/) under the [NASA Open Source Agreement (NOSA)](http://worldwind.arc.nasa.gov/worldwind-nosa-1.3.html).

* The application makes use of the OpenStreetMap Data.

![Screen](http://www.trilogis.it/wp-content/uploads/2013/07/logo_ufficiale-e1375429066884.png)
![Screen](http://www.nasa.gov/sites/all/themes/custom/NASAOmegaHTML5/images/nasa-logo.png)
![Screen](http://www.trilogis.it/wwwosm/images/logos/osm.png)

Further information and screenshots can be found at [our website](http://www.trilogis.it/wwwosm)

NASA and the NASA logo are registered trademarks of NASA, used with permission.
