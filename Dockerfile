FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Working directory
WORKDIR /home/node/app

RUN apk update \
  && apk add --no-cache python3 make g++ # for bcrypt

# Copy dependencies file
COPY package.json ./

# Switch current user to node user
USER node

# Install dependencies
RUN npm install

# Copy application code with the appropriate permissions to the application directory on the container
COPY --chown=node:node . .

# Expose port 8000
EXPOSE 9000

# Build in Container
RUN npm run build

# Run command to start the application
CMD [ "npm", "dev" ]