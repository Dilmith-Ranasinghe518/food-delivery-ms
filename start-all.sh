#!/bin/bash

# Function to kill all child processes on script exit
cleanup() {
    echo "Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Starting Auth Service..."
cd services/auth-service
npm install
npm run dev &
AUTH_PID=$!
cd ../..

echo "Starting Restaurant Service..."
cd services/restaurant-service
npm install
npm run dev &
RESTAURANT_PID=$!
cd ../..

echo "Services started. Press Ctrl+C to stop."
wait $AUTH_PID $RESTAURANT_PID
