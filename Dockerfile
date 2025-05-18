FROM node:lts-alpine3.20

# Create non-root user
RUN addgroup -S haraka && adduser -S haraka -G haraka

# Set working directory
WORKDIR /app

RUN apk add --no-cache python3 make g++ git

RUN npm install -g Haraka axios

RUN haraka -i .

# Set correct permissions for the non-root user
RUN chown -R haraka:haraka /app

# Switch to non-root user
USER haraka

# Copy local config files (optional)
COPY config/ ./config
COPY plugins/ ./plugins

EXPOSE 25

# Start Haraka
CMD ["haraka", "-c", "."]
