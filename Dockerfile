# The official python image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Default commands
CMD [ "python", "load_data.py" ]