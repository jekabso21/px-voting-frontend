# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies (which includes Vite)
RUN npm install

# Run the build process to generate the dist folder
RUN npm run build

# Copy the rest of the application code (after build)
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Use Vite's preview mode to serve the built files
CMD ["npm", "run", "start"]
