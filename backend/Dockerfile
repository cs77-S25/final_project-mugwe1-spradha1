# 1. Base image
FROM python:3.10-slim

# 2. Create & switch to app dir
WORKDIR /app

# 3. Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application code
COPY . .

# 5. Expose Flask port
EXPOSE 5001

CMD [ "python3", "app.py"]


#docker build --tag my-cool-project .

