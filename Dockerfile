# Use the official Node.js image as the base image
FROM node:18.15.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if you have it) into the working directory
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./

# Copy the rest of your application code into the container
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Expose the port your app runs on (adjust if necessary)
EXPOSE 3000

# Define the command to run your app with the filter
CMD ["pnpm", "dev", "--filter", "commerce-template"]