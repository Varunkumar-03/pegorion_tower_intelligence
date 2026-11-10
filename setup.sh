#!/bin/bash
set -e

echo "=== Pegorion Platform Setup Script ==="
echo ""

# Navigate to project root
cd /sessions/hopeful-stoic-noether/mnt/pegorion

echo "1. Installing Python dependencies..."
cd /sessions/hopeful-stoic-noether/mnt/pegorion/backend
pip3 install --upgrade pip -q
pip3 install -r requirements.txt -q
echo "   ✓ Python dependencies installed"

echo "2. Installing frontend dependencies..."
cd /sessions/hopeful-stoic-noether/mnt/pegorion/frontend
npm install --legacy-peer-deps
echo "   ✓ Frontend dependencies installed"

echo "3. Verifying installations..."
python3 -c "import fastapi; print('   ✓ FastAPI ready')"
python3 -c "import alembic; print('   ✓ Alembic ready')"
node -e "console.log('   ✓ Node.js ready')"

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To start the platform:"
echo "  Terminal 1: cd backend && uvicorn main:app --reload --port 8000"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Access points:"
echo "  - Frontend: http://localhost:3000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - Health:   http://localhost:8000/health"
