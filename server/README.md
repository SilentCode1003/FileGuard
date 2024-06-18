# Fileguard Server

## Getting Started

### Prerequisites

- [] Node
- [] MySQL
- [] MongoDB

### Setup

1. Install packages by running `npm install`
2. Create a _.env_ file using the _.env.example_ file as a guide.
3. Migrate and seed the database using `npm run db:migrate`

### Development

1. Start the dev server using `npm run dev`
2. Be sure to run `npx prisma migrate dev` after every change in _schema.prisma_
3. Go to http://localhost:3000/api-docs for swagger docs
4. Sometimes you might want to truncate tables and delete all records in the db. To do that, run `npm run db:reset`

### Production

1. Compile the src files using `npm run build`
2. Start the server by running `npm run start`
