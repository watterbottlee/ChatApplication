#stage1
FROM node:22 as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

#stage 2
FROM nginx:stable-alpine
copy --from=build /app/dist usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]