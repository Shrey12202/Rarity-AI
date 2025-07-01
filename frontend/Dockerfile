# Use an official Node.js image as the base
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Start the React development server
CMD ["npm", "start"] 