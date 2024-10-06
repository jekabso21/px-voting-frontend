#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
IMAGE_NAME="victoria-voting"
CONTAINER_NAME="victoria-voting"
PORT=5173

# Build the Docker image
echo "Building the Docker image..."
docker-compose build

# Stop and remove any existing container
if [ $(docker ps -aq -f name=$CONTAINER_NAME) ]; then
    echo "Stopping and removing existing container..."
    docker-compose down
fi

# Run the Docker container
echo "Running the Docker container..."
docker-compose up -d

echo "Deployment complete! Your app is running on http://localhost:$PORT"