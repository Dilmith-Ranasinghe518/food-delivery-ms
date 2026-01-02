#!/bin/bash

############################################
# Food Delivery Microservices Starter
############################################

set -e

# Cleanup function
cleanup() {
    echo ""
    echo "Stopping all port-forwards..."
    kill $(jobs -p) 2>/dev/null || true
    echo "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "======================================"
echo "🚀 Starting Food Delivery Microservices"
echo "======================================"

############################################
# 1. Build Docker Images
############################################

echo "📦 Building Docker images..."

docker build -t auth-service:latest services/auth-service
docker build -t restaurant-service:latest services/restaurant-service
docker build -t order-service:latest services/order-service
docker build -t delivery-service:latest services/delivery-service
docker build -t payment-service:latest services/payment-service

echo "✅ Docker images built"

############################################
# 2. Apply Kubernetes Manifests
############################################

echo "☸️ Applying Kubernetes manifests..."

if [ -f "k8s/secrets_local.yaml" ]; then
    echo "🔑 Applying LOCAL secrets..."
    kubectl apply -f k8s/secrets_local.yaml
else
    echo "⚠️ Applying placeholder secrets..."
    kubectl apply -f k8s/secrets.yaml
fi

kubectl apply -f k8s/auth/
kubectl apply -f k8s/restaurant/
kubectl apply -f k8s/order/
kubectl apply -f k8s/delivery/
kubectl apply -f k8s/payment/

############################################
# 3. Wait for Deployments
############################################

echo "⏳ Waiting for services to be ready..."

kubectl rollout status deployment/auth-service
kubectl rollout status deployment/restaurant-service
kubectl rollout status deployment/order-service
kubectl rollout status deployment/delivery-service
kubectl rollout status deployment/payment-service

echo "✅ All deployments are running"

############################################
# 4. Start Port-Forwards
############################################

echo "🔌 Starting port-forwards..."

echo "Auth Service        → http://localhost:4000"
kubectl port-forward svc/auth-service 4000:4000 &

echo "Restaurant Service  → http://localhost:5001"
kubectl port-forward svc/restaurant-service 5001:5001 &

echo "Order Service       → http://localhost:6001"
kubectl port-forward svc/order-service 6001:6001 &

echo "Delivery Service    → http://localhost:7001"
kubectl port-forward svc/delivery-service 7001:7001 &

echo "Payment Service    → http://localhost:8001"
kubectl port-forward svc/payment-service 8001:8001 &

############################################
# 5. Keep Script Alive
############################################

echo ""
echo "🎉 All services are UP and RUNNING"
echo "👉 Press Ctrl+C to stop everything"
echo ""

wait
