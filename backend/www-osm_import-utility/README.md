## www-osm import utility

It performs the import operation from an OSM changeset file to the local database.
It includes the parsing of the names and the level of details of the elements in order to
correctly perform the search and draw operations.

## Prerequisites
Environment

* Node.js installed
* PostgreSQL installed (preferably the latest stable version)
* Postgis extension installed and enable
* osm2psql tool installed



Node.js modules required:

* node postgres, `npm install pg`


## Running

* Run `import.sh <source file>`. Example : `import.sh italy.xml`

##TODO
Next updates: 
* history service
* improve import performances