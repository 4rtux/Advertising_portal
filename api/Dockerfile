# Use Node.js image with TypeScript support
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app code and compile TypeScript
COPY . .
RUN npm run build

# Expose the backend port
EXPOSE 4000

# Run the compiled app
CMD ["npm", "run", "start"]
