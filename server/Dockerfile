FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install -g pnpm@latest

RUN pnpm install --ignore-scripts && pnpm run build

EXPOSE 4020

CMD ["node", "dist/index.js"]