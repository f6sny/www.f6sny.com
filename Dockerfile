FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
EXPOSE 3000

FROM base as builder
WORKDIR /app

# Define build arguments
ARG NEXT_PUBLIC_API_URL
ARG API_URL

# Set as environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL

COPY . .
# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM base as production
WORKDIR /app

ENV NODE_ENV=production
# Runtime environment variables (can be overridden at container start)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Copy built assets and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content

CMD pnpm start