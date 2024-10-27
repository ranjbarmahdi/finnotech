# Base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY  package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
