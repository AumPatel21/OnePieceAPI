# official node image
FROM node:22-alpine

# set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy project files
COPY . .

# Generate prisma client
RUN npx prisma generate

# expose port
EXPOSE 3000

# start server
CMD ["npm", "run", "dev"]