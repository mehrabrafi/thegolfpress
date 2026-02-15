#!/bin/bash

# ──────────────────────────────────────────────────────────────────
# Switch Environment: dev ↔ prod
# Usage: ./scripts/switch-env.sh dev   (for local development)
#        ./scripts/switch-env.sh prod  (for production deployment)
# ──────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

BACKEND_ENV="$PROJECT_ROOT/backend/.env"
FRONTEND_ENV="$PROJECT_ROOT/frontend/.env.local"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

if [ -z "$1" ]; then
  echo ""
  echo -e "${RED}❌ Please specify an environment: dev or prod${NC}"
  echo ""
  echo -e "  ${CYAN}./scripts/switch-env.sh dev${NC}   → Local development"
  echo -e "  ${CYAN}./scripts/switch-env.sh prod${NC}  → Production deployment"
  echo ""
  exit 1
fi

MODE="$1"

if [ "$MODE" = "dev" ]; then
  echo ""
  echo -e "${CYAN}🔧 Switching to ${BOLD}DEVELOPMENT${NC}${CYAN} mode...${NC}"
  echo ""

  # ── Backend .env ──
  if [ -f "$BACKEND_ENV" ]; then
    # Switch NODE_ENV
    sed -i.bak 's/^NODE_ENV=production/NODE_ENV=development/' "$BACKEND_ENV"
    rm -f "$BACKEND_ENV.bak"
    echo -e "  ${GREEN}✅ Backend: NODE_ENV=development${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Backend .env not found at $BACKEND_ENV${NC}"
  fi

  # ── Frontend .env.local ──
  if [ -f "$FRONTEND_ENV" ]; then
    # Switch API URL to local proxy
    sed -i.bak 's|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:3000/api|' "$FRONTEND_ENV"
    rm -f "$FRONTEND_ENV.bak"
    echo -e "  ${GREEN}✅ Frontend: NEXT_PUBLIC_API_URL=http://localhost:3000/api${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Frontend .env.local not found at $FRONTEND_ENV${NC}"
  fi

  echo ""
  echo -e "${GREEN}🎉 Done! Restart your dev servers to apply changes.${NC}"
  echo -e "  ${CYAN}Backend:${NC}  cd backend && npm run start:dev"
  echo -e "  ${CYAN}Frontend:${NC} cd frontend && npm run dev"
  echo ""

elif [ "$MODE" = "prod" ]; then
  echo ""
  echo -e "${CYAN}🚀 Switching to ${BOLD}PRODUCTION${NC}${CYAN} mode...${NC}"
  echo ""

  # ── Backend .env ──
  if [ -f "$BACKEND_ENV" ]; then
    sed -i.bak 's/^NODE_ENV=development/NODE_ENV=production/' "$BACKEND_ENV"
    rm -f "$BACKEND_ENV.bak"
    echo -e "  ${GREEN}✅ Backend: NODE_ENV=production${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Backend .env not found at $BACKEND_ENV${NC}"
  fi

  # ── Frontend .env.local ──
  if [ -f "$FRONTEND_ENV" ]; then
    sed -i.bak 's|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://api.thegolfpress.com|' "$FRONTEND_ENV"
    rm -f "$FRONTEND_ENV.bak"
    echo -e "  ${GREEN}✅ Frontend: NEXT_PUBLIC_API_URL=https://api.thegolfpress.com${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Frontend .env.local not found at $FRONTEND_ENV${NC}"
  fi

  echo ""
  echo -e "${GREEN}🎉 Done! Ready for production build & deploy.${NC}"
  echo -e "  ${CYAN}Backend:${NC}  cd backend && npm run build && pm2 start dist/main.js"
  echo -e "  ${CYAN}Frontend:${NC} cd frontend && npm run build && pm2 start npm -- start"
  echo ""

else
  echo ""
  echo -e "${RED}❌ Unknown mode: '$MODE'${NC}"
  echo -e "  Use ${CYAN}dev${NC} or ${CYAN}prod${NC}"
  echo ""
  exit 1
fi
