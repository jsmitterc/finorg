# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# # Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# # Copy the entire project
COPY . .

# # Build the Next.js app
RUN npm run build

# # Expose port 3000
EXPOSE 3000

# # Start the app
CMD ["npm", "run", "start"]