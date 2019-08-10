FROM mhart/alpine-node:11.14

# Working directory
WORKDIR /app

# Copy current folder to docker /app
COPY . .

# Install dependencies, build, and clean up for production
RUN mv .env.prod .env
RUN npm install && npm run build
RUN npm ci --production

# Stage 2 build to copy only needed files
FROM mhart/alpine-node:base-11.14

WORKDIR /app
COPY --from=0 /app .

EXPOSE 3000
CMD ["node", "__sapper__/build"]