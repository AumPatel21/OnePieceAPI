# official node image
FROM node:22

# set working directory
WORKDIR /app

# Install python & its dependencies so load_data.py can run
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-psycopg2 \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y netcat-openbsd

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