# AutolystAI Backend

## Quick Start

```bash
# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# 2. Install dependencies
pip install -e .

# 3. Copy env file
copy .env.example .env  # then edit .env with your values

# 4. Run the server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login & get JWT |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/datasets/upload` | Upload a dataset |
| GET | `/api/v1/datasets/` | List user datasets |
| GET | `/api/v1/datasets/{id}` | Get dataset details |
| DELETE | `/api/v1/datasets/{id}` | Delete a dataset |
| POST | `/api/v1/chat/send` | Send chat message |
| GET | `/api/v1/chat/conversations` | List conversations |
| GET | `/api/v1/chat/conversations/{id}` | Get conversation |
| POST | `/api/v1/analysis/run` | Run an analysis |
| GET | `/api/v1/analysis/` | List analyses |
| GET | `/api/v1/analysis/{id}` | Get analysis results |
| GET | `/api/health` | Health check |
