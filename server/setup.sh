#!/bin/bash

# Create necessary directories
mkdir -p logs uploads

# Install dependencies
npm install

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "Redis is not installed. Please install Redis first."
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo "Redis is not running. Starting Redis..."
    redis-server &
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
UPLOAD_DIR=uploads
EOL
    echo "Please update the .env file with your configuration."
fi

echo "Setup completed successfully!"

npm run dev 