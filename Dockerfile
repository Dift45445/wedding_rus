
# Build stage
FROM oven/bun:1.1 as builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend
ENV NODE_ENV=production
RUN bun run build

# Production stage
FROM oven/bun:1.1-slim
WORKDIR /app

# Install production dependencies only
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy backend code
COPY src ./src
COPY scripts ./scripts

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start server
CMD ["bun", "src/server/server.js"]
