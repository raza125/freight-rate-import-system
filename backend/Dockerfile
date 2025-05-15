FROM node:22

WORKDIR /app

COPY . .

RUN npm install --workspace backend

WORKDIR /app/backend

EXPOSE 3001

CMD ["npm", "run", "dev"]