#!/bin/bash

# Запуск первого скрипта
echo "Запуск script1.sh..."
bash script1.sh

# Проверка успешности выполнения первого скрипта
if [ $? -eq 0 ]; then
    echo "script1.sh выполнен успешно."
else
    echo "script1.sh завершился с ошибкой."
    exit 1
fi

# Запуск второго скрипта
echo "Запуск script2.sh..."
bash script2.sh

# Проверка успешности выполнения второго скрипта
if [ $? -eq 0 ]; then
    echo "script2.sh выполнен успешно."
else
    echo "script2.sh завершился с ошибкой."
    exit 1
fi

echo "База данных создана."
