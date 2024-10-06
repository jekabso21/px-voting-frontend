# Use Node.js 16 as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first, so Docker can cache the npm install step
COPY package*.json ./

# Install all dependencies, including devDependencies (which includes Vite)
RUN npm install

# Copy the rest of the application code, including index.html and source files
COPY . .

# Run the build process to generate the dist folder
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Serve the built files using Vite's preview mode
CMD ["npm", "run", "start"]
