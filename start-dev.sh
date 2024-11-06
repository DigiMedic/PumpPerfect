#!/bin/bash

# Kontrola Redis serveru
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Spouštím Redis server..."
    redis-server &
    sleep 2
fi

# Spuštění backend serveru
echo "Spouštím backend server..."
cd backend
source venv/bin/activate
uvicorn src.main:app --reload &

# Návrat do kořenového adresáře
cd ..

# Spuštění frontend serveru
echo "Spouštím frontend server..."
npm run dev
