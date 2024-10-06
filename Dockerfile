# Use Node.js 16 as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Run the build process to generate the dist folder
RUN npm run build

# Copy the rest of the application code (after build)
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Serve the built files using Vite's preview mode
CMD ["npm", "run", "start"]
