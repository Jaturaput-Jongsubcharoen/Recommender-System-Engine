FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend
COPY recipes.json music_recommendations.json ./
WORKDIR /app/backend
EXPOSE 8000
CMD ["python", "run.py"]
