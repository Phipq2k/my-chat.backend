FROM node:14.17.1

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

# Development
CMD ["yarn","dev"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
