# official node image
FROM node:22-alpine

# set working directory
WORKDIR /app

# Install python so load_data.py can run
RUN apk add --no-cache python3 py3-pip
# Install psycopg2 for Python
RUN apk add --no-cache py3-psycopg2

RUN apk add --no-cache netcat-openbsd

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

# Run init script first
ENTRYPOINT [ "sh", "init_db.sh" ]
CMD [ "npm", "run", "dev" ]