FROM node:alpine
WORKDIR '/app'

COPY ./package.json ./
RUN npm install

COPY ./ ./

#All the prodc assests will be placed at location /app/build after below command executes.
CMD ["npm", "run", "build"]

#Below will change the default port that NginX listens to.
FROM nginx
EXPOSE 3000

#All the files/folders created should be copied using the below commands.
COPY --from=0 /app/build /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
