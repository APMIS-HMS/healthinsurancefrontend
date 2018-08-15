FROM node:6


ENV PATH /var/www/node_modules/.bin:$PATH

WORKDIR /var/www

COPY package*.json ./

RUN npm install
RUN npm install typescript@'>=2.1.0 <2.4.0'

COPY . /var/www

EXPOSE 4900 4200

CMD ng serve
