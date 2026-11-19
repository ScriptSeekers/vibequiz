# Vibe Quiz — FastAPI & AI Microservice

This microservice handles:
1. **OpenAI Structured Outputs:** Translates user quiz configurations into strictly formatted, curriculum-aligned questions, distractors, and step-by-step explanations.
2. **PDF Parsing:** Ingests textbooks, notes, and syllabus chapters up to 25MB using `pypdf`.
3. **Deterministic Evaluation:** Server-side score validation preventing client score tampering.

---

## 🚀 Setup & Execution

### 1. Create a Python Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set OpenAI API Key
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="sk-your-openai-key"

# Linux / Mac
export OPENAI_API_KEY="sk-your-openai-key"
```

### 4. Run the Server
```bash
uvicorn main:app --reload --port 8000
```

The interactive OpenAPI documentation will be accessible at:
[http://localhost:8000/docs](http://localhost:8000/docs)
