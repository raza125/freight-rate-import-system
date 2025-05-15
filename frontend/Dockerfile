FROM node:22

WORKDIR /app

COPY . .

RUN npm install --workspace frontend

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]