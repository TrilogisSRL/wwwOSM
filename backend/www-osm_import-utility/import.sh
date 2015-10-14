#!/usr/bin/env bash

DIR=$PWD/../www-osm_import-utility

if [ -z "$1" ]
  then
    echo "No argument supplied. Please select the source path"
else {
    #echo "0. START: $(date)" && \
    #echo "1. Remove: $DIR/temp/$2" && \
    #rm -f $DIR/temp/$2 && \
    #echo "2. Download: $1" && \
    #wget -P $DIR/temp $1  && \
    echo "3. IMPORT: $2" && \
    echo "3.1. Clean Temp Database:" && \
    echo $DIR/clean-temp-database && \
    node $DIR/clean-temp-database && \
    echo "3.2. Handle OSM Data:" && \
	osm2pgsql -d gis -l -C 4096 $DIR/temp/$2 && \
	echo $PWD && \
	node $DIR/setTable && \
	node $DIR/start-import && \
	node $DIR/softDelete && \
	node $DIR/applyTimestamp && \
	node $DIR/moveRows && \
	node $DIR/updateNames && \
	node $DIR/reindex && \
	node $DIR/hardDelete && \
	#node $DIR/clean-temp-database && \
	echo "done" && \
	echo "END IMPORT: $(date)"
}
fi	
