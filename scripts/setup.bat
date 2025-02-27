@echo off 
echo Setting up PDF Classroom Manager... 
echo. 
echo Creating Python virtual environment... 
cd backend 
python -m venv venv 
call venv\Scripts\activate 
echo Installing Python dependencies... 
pip install -r requirements.txt 
echo. 
cd ..\frontend 
echo Installing Node.js dependencies... 
npm install 
echo. 
echo Setup complete! 
echo To start the backend: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload 
echo To start the frontend: cd frontend && npm run dev 
