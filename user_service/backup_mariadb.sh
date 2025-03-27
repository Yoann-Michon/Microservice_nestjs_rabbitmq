#!/bin/bash

# Variables pour MariaDB
CONTAINER_NAME="4webd_nestjs-mariadb-user-1" 
DB_HOST="localhost"                          
DB_PORT="3306"                              
DB_USERNAME="user_user"                     
DB_PASSWORD="user_password"                  
DB_NAME="user_db"                            
BACKUP_DIR="/home/user/backups/mariadb"     
DATE=$(date +"%Y%m%d%H%M")                  


mkdir -p $BACKUP_DIR/$DATE


docker exec $CONTAINER_NAME sh -c "exec mysqldump -h $DB_HOST -P $DB_PORT -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME" > $BACKUP_DIR/$DATE/${DB_NAME}_backup.sql


gzip $BACKUP_DIR/$DATE/${DB_NAME}_backup.sql


find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -exec rm {} \;
