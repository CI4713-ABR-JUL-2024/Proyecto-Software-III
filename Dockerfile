FROM node:22-alpine

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install next

RUN npm i

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD npm run dev