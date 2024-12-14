-- написать скрипт создания базы данных сначала вызываем init-db.sh потом init-db-2.sh
-- Создание базы данных
CREATE DATABASE darkstore;
\c darkstore
CREATE USER darkstoreroot WITH PASSWORD 'test';
ALTER ROLE darkstoreroot WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE darkstore TO darkstoreroot;
GRANT CREATE ON SCHEMA public TO darkstoreroot;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO darkstoreroot;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO darkstoreroot;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO darkstoreroot;
\q
