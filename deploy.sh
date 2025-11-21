#!/bin/bash

# Codemify Demo App - Quick Deployment Script
# This script helps you deploy the application to codemify.com

set -e

echo "🚀 Codemify Demo App Deployment Assistant"
echo "==========================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js $(node --version) installed"
echo "✅ npm $(npm --version) installed"
echo ""

# Deployment method selection
echo "Please select your deployment method:"
echo "1) Vercel (Recommended - Easiest)"
echo "2) Docker + VPS (DigitalOcean, AWS EC2, etc.)"
echo "3) Manual Setup (I'll set it up myself)"
echo "4) Cancel"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 Vercel Deployment Selected"
        echo "=============================="
        echo ""
        
        if ! command_exists vercel; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "✅ Vercel CLI ready"
        echo ""
        echo "Next steps:"
        echo "1. Run 'vercel login' to authenticate"
        echo "2. Run 'vercel' to deploy"
        echo "3. Follow prompts to configure your project"
        echo "4. Add codemify.com domain in Vercel dashboard"
        echo ""
        read -p "Would you like to deploy now? (y/n): " deploy_now
        
        if [[ $deploy_now == "y" || $deploy_now == "Y" ]]; then
            vercel
        fi
        ;;
        
    2)
        echo ""
        echo "🐳 Docker Deployment Selected"
        echo "============================="
        echo ""
        
        if ! command_exists docker; then
            echo "❌ Docker is not installed. Please install Docker from https://docker.com/"
            exit 1
        fi
        
        echo "✅ Docker installed"
        echo ""
        echo "Building Docker images..."
        docker-compose build
        
        echo ""
        echo "Docker images built successfully!"
        echo ""
        echo "To deploy to your VPS:"
        echo "1. Push code to your server: scp -r . user@codemify.com:/app"
        echo "2. SSH into server: ssh user@codemify.com"
        echo "3. Run: cd /app && docker-compose up -d"
        echo "4. Configure DNS to point codemify.com to your server IP"
        echo ""
        ;;
        
    3)
        echo ""
        echo "📚 Manual Setup Instructions"
        echo "============================"
        echo ""
        echo "Please refer to DEPLOYMENT.md for detailed instructions."
        echo ""
        echo "Quick overview:"
        echo "1. Build frontend: cd frontend && npm install && npm run build"
        echo "2. Install backend: cd backend && npm install"
        echo "3. Deploy frontend build/ to your web server"
        echo "4. Run backend: cd backend && npm start"
        echo "5. Configure reverse proxy (nginx/apache)"
        echo "6. Point codemify.com DNS to your server"
        echo ""
        ;;
        
    4)
        echo "Deployment cancelled."
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🐛 For issues, check the GitHub repository"
echo ""
echo "Good luck with your deployment! 🎉"
