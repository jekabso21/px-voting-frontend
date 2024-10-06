# Use the official Node.js image as a base
FROM node:16 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install  # Remove --only=production to install all dependencies

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create a production image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy only the built files from the previous stage
COPY --from=build /usr/src/app/dist ./dist

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Expose the port your app runs on
EXPOSE 5173

# Command to run the application
CMD ["node", "dist/index.js"]  # Adjust this if your entry point is different