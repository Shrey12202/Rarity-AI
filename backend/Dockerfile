# Use an official Node.js image as the base
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Install Python, pip, and venv, then install Python dependencies in a venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

# Expose backend port (adjust if needed)
EXPOSE 5000

# Start the Node.js backend
CMD ["npm", "start"] 