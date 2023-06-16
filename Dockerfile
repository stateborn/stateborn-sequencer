FROM node:20.3.0-alpine

WORKDIR /
ADD src/ /src
ADD package.json /
ADD tsconfig.json /
RUN apk update && rm -rf /var/cache/apk/* && npm install && npm run build

CMD ["npm", "run", "start"]
