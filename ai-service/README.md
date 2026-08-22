# Dayflow AI Service

Modular Python FastAPI service powering Dayflow's AI HR Assistant and Automated Attendance Insights engine.

## Features
- **Natural Language HR Query Engine**: Processes user queries regarding leaves, attendance rate, check-in history, department metrics, and payroll.
- **Attendance Anomaly & Pattern Insights**: Evaluates employee check-in trends and flags risk patterns (frequent tardiness, consecutive absences, burnout indicators).

## Local Execution

```bash
cd ai-service

# Create virtual environment
python -m venv venv
# Activate on Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app:app --port 8000 --reload
```

Server endpoints will be live at `http://localhost:8000`.
Swagger docs accessible at `http://localhost:8000/docs`.
