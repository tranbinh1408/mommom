# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY mommom_food/package*.json ./mommom_food/
COPY quan_ly_mommom_food/package*.json ./quan_ly_mommom_food/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build frontend
RUN cd mommom_food && npm run build

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
