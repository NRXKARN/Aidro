# Use official lightweight Python image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port (FastAPI default)
EXPOSE 8080

# Command to run the application (using 8080 for GCP App Engine/Cloud Run)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
