# Local Development

## Prerequisites

- Node.js 20+
- Docker
- PostgreSQL (optional — Docker Compose handles it)

## Setup

```bash
# Clone and install
git clone <repo-url>
cd top-members
npm install

# Start both client + server with hot reload
npm run dev
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

```env
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/saramsg
SESSION_SECRET=your-secret
MEMBERSHIP_PASSCODE=your-passcode
```

## Docker Compose (standalone)

```bash
docker compose up -d        # Full stack
docker compose -f server/docker-compose.yml up -d  # Server only
```

## Running Tests

```bash
npm test --prefix server
```
