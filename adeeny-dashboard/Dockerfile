# Step 1: Use an official Nginx image
FROM nginx:alpine

# Step 2: Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Step 3: Copy the build files to the Nginx static directory
COPY ./adeeny-dashboard/dist /usr/share/nginx/html

# Step 4: Expose port 80
EXPOSE 80

# Step 5: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
