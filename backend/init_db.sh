#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# wait until Postgres is accepting connections
while ! nc -z "$DB_HOST" 5432; do
    sleep 1
done
echo "✅ Database is ready!"


echo "Running prisma migrations..."
# npx prisma migrate dev --name init  # to populate the DB initially
npx prisma migrate deploy
echo "✅ Migrations applied!"

echo "Loading scraped data..."
python3 scripts/load_data.py
echo "✅ Data loaded successfully!"

echo "🚀 Starting backend server..."
exec npm run dev