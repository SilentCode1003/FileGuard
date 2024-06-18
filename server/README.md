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

### Production

1. Compile the src files using `npm run build`
2. Start the server by running `npm run start`
