FROM node:carbon

WORKDIR /var/www

ENV PATH /var/www/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
RUN npm install typescript@'>=2.1.0 <2.4.0'

COPY . /var/www

EXPOSE 4200

CMD ng serve --host 0.0.0.0
