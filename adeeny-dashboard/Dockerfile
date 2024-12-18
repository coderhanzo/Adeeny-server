FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install vite --save-dev

COPY . .

RUN npm run build

# Use nginx as the base image for serving the React build
FROM nginx:alpine

# Copy the pre-built React application to nginx's default directory
COPY ./adeeny-dashboard/dist /usr/share/nginx/html

# Expose port 80 for the HTTP server
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
