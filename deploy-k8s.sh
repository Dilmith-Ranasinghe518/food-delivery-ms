#!/bin/bash

# Function to kill child processes (port-forwards) on exit
cleanup() {
    echo "Stopping port-forwards..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Building Docker images..."
cd services/auth-service
docker build -t auth-service:latest .
cd ../restaurant-service
docker build -t restaurant-service:latest .
cd ../..

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/auth/
kubectl apply -f k8s/restaurant/

echo "Waiting for deployments to roll out..."
kubectl rollout status deployment/auth-service
kubectl rollout status deployment/restaurant-service

echo "Starting Port Forwards..."
echo "Auth Service will be available at http://localhost:4000"
echo "Restaurant Service will be available at http://localhost:5001"

# Run port-forwards in background
kubectl port-forward svc/auth-service 4000:4000 &
PID_AUTH=$!
kubectl port-forward svc/restaurant-service 5001:5001 &
PID_RESTAURANT=$!

echo "Services are ready!"
wait $PID_AUTH $PID_RESTAURANT
