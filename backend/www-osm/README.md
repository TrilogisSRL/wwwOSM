## www-osm

It provides geodata from an OpenStreetMap local database with the purpose of be used by the Web World Wind

## Prerequisites
Environment
* Node.js installed
* PostgreSQL installed (preferably the latest stable version)
* Postgis extension installed and enable

Database
* import the data available at `db/dump` [*coming soon* the module for the import from xml and live osm APIs]

Node.js modules required:
* node-simple-router,`npm install node-simple-router` [as a temporary solution for the routing problem]
* node postgres, `npm install pg`

## Configuration

Geodata is stored in a local database. The credential can be set in the file `db/db.js`.
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

## Running

* Install Node
* Run `run.sh`
* APIs are available at `http://wwwosm.trilogis.it/api/`

## Services

* `point/<id>`, GET, it returns a node/point object as JSON with the given identifier. If the identifier is not recognized, then an empty object is returned. 
* `polygon/<id>`, GET,  it returns a way/polygon object as JSON with the given identifier. If the identifier is not recognized, then an empty object is returned.
* `polyline/<d>`, GET, it returns a way/polyline object as JSON with the given identifier. If the identifier is not recognized, then an empty object is returned. 
* `/search/line/<lod>/<match>`, GET, the service searches for a match over the roads/polyline elements with the given level of detail as threshold, returning the objects as JSON list. Partial names are allowed. 
* `/search/point/<lod>/<match>`, GET, the service searches for a match over the point/node elements with the given level of detail as threshold, returning the objects as JSON list. Partial names are allowed. 
* `/search/polygon/<lod>/<match>`, GET, the service searches for a match over the polygon elements with the given level of detail as threshold, returning the objects as JSON list. Partial names are allowed. 
* `/bbox`, POST, it retrieves the elements within given boundary and with the given level of detail.

    Post request example:
    ```
         {
         "latitudeLB": "46.06040",
         "latitudeUB": "46.06840",
         "longitudeLB": "11.11043",
         "longitudeUB": "11.11443",
         "lod": 15
         }
    ```

##API Url
*coming soon*

##TODO
Next updates: 
* the level of detail is not yet assigned to all types of geometries
* the color assigned to the geometries is under revision