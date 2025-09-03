# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
ARG VITE_REACT_APP_API_BASE_URL
ENV VITE_REACT_APP_API_BASE_URL=$VITE_REACT_APP_API_BASE_URL
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]