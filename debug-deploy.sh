#!/bin/bash

echo "🔍 Bundle App Deployment Debug Script"
echo "does it works?"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
docker-compose down --volumes --remove-orphans
docker system prune -f

# Rebuild and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
echo "📊 Service Status:"
docker-compose ps

# Check logs
echo "📝 Recent logs:"
echo "--- Backend logs ---"
docker-compose logs --tail=20 backend

echo "--- Nginx logs ---"
docker-compose logs --tail=20 nginx-proxy

# Test endpoints
echo "🧪 Testing endpoints..."
echo "Health check:"
curl -f http://localhost:8019/health || echo "❌ Health check failed"

echo "Frontend:"
curl -f -I http://localhost:8019/ || echo "❌ Frontend not accessible"

echo "✅ Debug complete. Check the logs above for any issues."
