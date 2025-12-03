FROM node:22-bookworm-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json ./

RUN pnpm install --prod --no-lockfile && \
    rm -rf /root/.cache /root/.npm /root/.pnpm-store

COPY dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
