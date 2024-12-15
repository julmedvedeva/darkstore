# #!/bin/bash

# # Параметры подключения к базе данных
# DB_HOST="localhost"
# DB_PORT="5432"
# DB_NAME="postgres"
# DB_USER="postgres"
# DB_PASSWORD="your_password"

# # Путь к файлам
# SQL_FILE_1="server/database/init-db.sql"
# SQL_FILE_2="server/database/init-db-2.sql"

# # Выполнение первого SQL-скрипта
# echo "Creating database and user..."
# PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE_1

# # Проверка на успешность выполнения первого скрипта
# if [ $? -eq 0 ]; then
#   echo "Database and user created successfully."
# else
#   echo "Error creating database or user."
#   exit 1
# fi

# # Выполнение второго SQL-скрипта
# echo "Creating tables and inserting data..."
# PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d darkstore -f $SQL_FILE_2

# # Проверка на успешность выполнения второго скрипта
# if [ $? -eq 0 ]; then
#   echo "Tables created and data inserted successfully."
# else
#   echo "Error creating tables or inserting data."
#   exit 1
# fi

# echo "Database setup completed."

#!/bin/bash

# Параметры подключения к базе данных
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_ENTYTIES="darkstore"

# Путь к файлам
SQL_FILE_1="server/database/init-db.sql"
SQL_FILE_2="server/database/init-db-2.sql"

# Выполнение первого SQL-скрипта
echo "Creating database and user..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE_1

# Проверка на успешность выполнения первого скрипта
if [ $? -eq 0 ]; then
  echo "Database and user created successfully."
else
  echo "Error creating database or user."
  exit 1
fi

# Выполнение второго SQL-скрипта
echo "Creating tables and inserting data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_ENTYTIES -f $SQL_FILE_2

# Проверка на успешность выполнения второго скрипта
if [ $? -eq 0 ]; then
  echo "Tables created and data inserted successfully."
else
  echo "Error creating tables or inserting data."
  exit 1
fi

echo "Database setup completed."
