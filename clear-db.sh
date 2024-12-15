#!/bin/bash

# Параметры подключения к базе данных
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="darkstore"
DB_USER="darkstoreroot"
DB_PASSWORD="test"

# Подключение с правами суперпользователя для выполнения административных задач
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME -c "SET session_replication_role = replica;"

# Проверка существования схемы public
SCHEMA_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname = 'public';")

if [ "$SCHEMA_EXISTS" == "1" ]; then
  # Удаление всех данных из таблиц, если схема существует
  TABLES=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -Atc "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
  for TABLE in $TABLES; do
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "TRUNCATE TABLE public.$TABLE RESTART IDENTITY CASCADE;"
  done

  # Удаление всех таблиц и связей
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME -c "DROP SCHEMA public CASCADE;"
fi

# Удаление всех ролей, принадлежащих пользователю
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "DROP OWNED BY $DB_USER CASCADE;"

# Удаление роли darkstoreroot
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME -c "DROP ROLE IF EXISTS $DB_USER;"

# Восстановление сессии репликации
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME -c "SET session_replication_role = DEFAULT;"

# Удаление всех разрешений
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "REVOKE ALL PRIVILEGES ON DATABASE $DB_NAME FROM PUBLIC;"

# Удаление базы данных
echo "Dropping the database $DB_NAME..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Проверка на успешность удаления базы данных
if [ $? -eq 0 ]; then
  echo "Database $DB_NAME dropped successfully."
else
  echo "Error dropping database $DB_NAME."
  exit 1
fi

echo "All tables, relationships, roles, and data have been deleted from the database."
