# API Documentation

# API Documentation

This document provides details about the API endpoints for managing users, stores, items, transactions, reports, and more using Express.js and Prisma.

## Base URL

```
http://localhost:3000
```

---

## Authentication

### POST `/signup`

Create a new user.

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "age": 30,
  "point": 0,
  "gender": "male"
}
```

**Response**:

- `201 Created`: User created successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: User creation failed.

---

### POST `/login`

Login a user and generate a JWT token.

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:

- `200 OK`: Login successful, returns a JWT token and user info.
- `400 Bad Request`: Missing email or password.
- `401 Unauthorized`: Invalid credentials.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Login failed.

---

## User CRUD Endpoints

### GET `/users`

Fetch all users.

**Response**:

- `200 OK`: Returns an array of users.
- `500 Internal Server Error`: Failed to fetch users.

---

### GET `/users/:userId`

Fetch a specific user by `userId`.

**Response**:

- `200 OK`: Returns the user object.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Failed to fetch user.

---

### PUT `/users/:id`

Update user details.

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "newpassword123",
  "role": "admin",
  "phoneNumber": "9876543210",
  "address": "456 Another St",
  "age": 35,
  "point": 10,
  "gender": "male"
}
```

**Response**:

- `200 OK`: User updated successfully.
- `500 Internal Server Error`: Failed to update user.

---

### DELETE `/users/:id`

Delete a user by `id`.

**Response**:

- `200 OK`: User deleted successfully.
- `500 Internal Server Error`: Failed to delete user.

---

## Store CRUD Endpoints

### POST `/toko`

Create a new store.

**Request Body**:

```json
{
  "nama": "Store Name",
  "alamat": "Store Address",
  "imageUrl": "https://example.com/store.jpg"
}
```

**Response**:

- `201 Created`: Store created successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: Failed to create store.

---

### GET `/toko`

Fetch all stores.

**Response**:

- `200 OK`: Returns an array of stores.
- `500 Internal Server Error`: Failed to fetch stores.

---

### PUT `/toko/:id`

Update store details.

**Request Body**:

```json
{
  "nama": "Updated Store Name",
  "alamat": "Updated Store Address",
  "imageUrl": "https://example.com/updated-store.jpg"
}
```

**Response**:

- `200 OK`: Store updated successfully.
- `500 Internal Server Error`: Failed to update store.

---

### DELETE `/toko/:id`

Delete a store by `id`.

**Response**:

- `200 OK`: Store deleted successfully.
- `500 Internal Server Error`: Failed to delete store.

---

## Item CRUD Endpoints

### POST `/barang`

Create a new item for a store.

**Request Body**:

```json
{
  "nama": "Item Name",
  "harga": 100,
  "stok": 20,
  "imageUrl": "https://example.com/item.jpg",
  "tokoId": 1
}
```

**Response**:

- `201 Created`: Item created successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: Failed to create item.

---

### GET `/barang`

Fetch all items.

**Response**:

- `200 OK`: Returns an array of items.
- `500 Internal Server Error`: Failed to fetch items.

---

### PUT `/barang/:id`

Update item details.

**Request Body**:

```json
{
  "nama": "Updated Item Name",
  "harga": 150,
  "stok": 30,
  "imageUrl": "https://example.com/updated-item.jpg"
}
```

**Response**:

- `200 OK`: Item updated successfully.
- `500 Internal Server Error`: Failed to update item.

---

### DELETE `/barang/:id`

Delete an item by `id`.

**Response**:

- `200 OK`: Item deleted successfully.
- `500 Internal Server Error`: Failed to delete item.

---

## Bank Sampah CRUD Endpoints

### POST `/bank-sampah`

Create a new Bank Sampah.

**Request Body**:

```json
{
  "name": "Bank Sampah Name",
  "location": "Bank Sampah Location"
}
```

**Response**:

- `201 Created`: Bank Sampah created successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: Failed to create Bank Sampah.

---

### GET `/bank-sampah`

Fetch all Bank Sampah.

**Response**:

- `200 OK`: Returns an array of Bank Sampah.
- `500 Internal Server Error`: Failed to fetch Bank Sampah.

---

### PUT `/bank-sampah/:id`

Update Bank Sampah details.

**Request Body**:

```json
{
  "name": "Updated Bank Sampah Name",
  "location": "Updated Bank Sampah Location"
}
```

**Response**:

- `200 OK`: Bank Sampah updated successfully.
- `500 Internal Server Error`: Failed to update Bank Sampah.

---

### DELETE `/bank-sampah/:id`

Delete a Bank Sampah by `id`.

**Response**:

- `200 OK`: Bank Sampah deleted successfully.
- `500 Internal Server Error`: Failed to delete Bank Sampah.

---

## Sampah CRUD Endpoints

### POST `/sampah`

Create a new Sampah category.

**Request Body**:

```json
{
  "category": "Plastic",
  "price": 100,
  "bankSampahId": 1
}
```

**Response**:

- `201 Created`: Sampah created successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: Failed to create Sampah.

---

### GET `/sampah`

Fetch all Sampah categories.

**Response**:

- `200 OK`: Returns an array of Sampah.
- `500 Internal Server Error`: Failed to fetch Sampah.

---

### PUT `/sampah/:id`

Update Sampah details.

**Request Body**:

```json
{
  "category": "Updated Plastic",
  "price": 120
}
```

**Response**:

- `200 OK`: Sampah updated successfully.
- `500 Internal Server Error`: Failed to update Sampah.

---

### DELETE `/sampah/:id`

Delete a Sampah category by `id`.

**Response**:

- `200 OK`: Sampah deleted successfully.
- `500 Internal Server Error`: Failed to delete Sampah.

---

## Pelaporan CRUD Endpoints

### POST `/pelaporan`

Create a new report.


# REST API Example

This example shows how to implement a **REST API with TypeScript** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). The example uses an SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db).

## Getting started

### 1. Download example and install dependencies

Download this example:

```
npx try-prisma@latest --template orm/rest-express
```

Install npm dependencies:

```
cd rest-express
npm install
```

<details><summary><strong>Alternative:</strong> Clone the entire repo</summary>

Clone this repository:

```
git clone git@github.com:prisma/prisma-examples.git --depth=1
```

Install npm dependencies:

```
cd prisma-examples/orm/rest-express
npm install
```

</details>

#### [Optional] Switch database to Prisma Postgres

This example uses a local SQLite database by default. If you want to use to [Prisma Postgres](https://prisma.io/postgres), follow these instructions (otherwise, skip to the next step):

1. Set up a new Prisma Postgres instance in the Prisma Data Platform [Console](https://console.prisma.io) and copy the database connection URL.
2. Update the `datasource` block to use `postgresql` as the `provider` and paste the database connection URL as the value for `url`:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = "prisma+postgres://accelerate.prisma-data.net/?api_key=ey...."
    }
    ```

    > **Note**: In production environments, we recommend that you set your connection URL via an [environment variable](https://www.prisma.io/docs/orm/more/development-environment/environment-variables/managing-env-files-and-setting-variables), e.g. using a `.env` file.
3. Install the Prisma Accelerate extension:
    ```
    npm install @prisma/extension-accelerate
    ```
4. Add the Accelerate extension to the `PrismaClient` instance:
    ```diff
    + import { withAccelerate } from "@prisma/extension-accelerate"

    + const prisma = new PrismaClient().$extends(withAccelerate())
    ```

That's it, your project is now configured to use Prisma Postgres!

### 2. Create and seed the database

Run the following command to create your database. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

**If you switched to Prisma Postgres in the previous step**, you need to trigger seeding manually (because Prisma Postgres already created an empty database instance for you, so seeding isn't triggered):

```
npx prisma db seed
```


### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/feed`](http://localhost:3000/feed).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/post/:id`: Fetch a single post by its `id`
- `/feed?searchString={searchString}&take={take}&skip={skip}&orderBy={orderBy}`: Fetch all _published_ posts
  - Query Parameters
    - `searchString` (optional): This filters posts by `title` or `content`
    - `take` (optional): This specifies how many objects should be returned in the list
    - `skip` (optional): This specifies how many of the returned objects in the list should be skipped
    - `orderBy` (optional): The sort order for posts in either ascending or descending order. The value can either `asc` or `desc`
- `/user/:id/drafts`: Fetch user's drafts by their `id`
- `/users`: Fetch all users
### `POST`

- `/post`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (optional): The content of the post
    - `authorEmail: String` (required): The email of the user that creates the post
- `/signup`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (optional): The name of the user
    - `postData: PostCreateInput[]` (optional): The posts of the user

### `PUT`

- `/publish/:id`: Toggle the publish value of a post by its `id`
- `/post/:id/views`: Increases the `viewCount` of a `Post` by one `id`

### `DELETE`

- `/post/:id`: Delete a post by its `id`


## Evolving the app

Evolving the application typically requires two steps:

1. Migrate your database using Prisma Migrate
1. Update your application code

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Profile`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// ./prisma/schema.prisma

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  user   User    @relation(fields: [userId], references: [id])
+  userId Int     @unique
+}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```
npx prisma migrate dev --name add-profile
```

This adds another migration to the `prisma/migrations` directory and creates the new `Profile` table in the database.

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Profile` table. Those operations can be used to implement API endpoints in the REST API.

#### 2.1 Add the API endpoint to your app

Update your `index.ts` file by adding a new endpoint to your API:

```ts
app.post('/user/:id/profile', async (req, res) => {
  const { id } = req.params
  const { bio } = req.body

  const profile = await prisma.profile.create({
    data: {
      bio,
      user: {
        connect: {
          id: Number(id)
        }
      }
    }
  })

  res.json(profile)
})
```

#### 2.2 Testing out your new endpoint

Restart your application server and test out your new endpoint.

##### `POST`

- `/user/:id/profile`: Create a new profile based on the user id
  - Body:
    - `bio: String` : The bio of the user


<details><summary>Expand to view more sample Prisma Client queries on <code>Profile</code></summary>

Here are some more sample Prisma Client queries on the new <code>Profile</code> model:

##### Create a new profile for an existing user

```ts
const profile = await prisma.profile.create({
  data: {
    bio: 'Hello World',
    user: {
      connect: { email: 'alice@prisma.io' },
    },
  },
})
```

##### Create a new user with a new profile

```ts
const user = await prisma.user.create({
  data: {
    email: 'john@prisma.io',
    name: 'John',
    profile: {
      create: {
        bio: 'Hello World',
      },
    },
  },
})
```

##### Update the profile of an existing user

```ts
const userWithUpdatedProfile = await prisma.user.update({
  where: { email: 'alice@prisma.io' },
  data: {
    profile: {
      update: {
        bio: 'Hello Friends',
      },
    },
  },
})
```

</details>

## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in [`prisma/schema.prisma`](./prisma/schema.prisma) by reconfiguring the `datasource` block. 

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<details><summary>Expand for an overview of example configurations with different databases</summary>

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

Here is an example connection string with a local PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
}
```

### MySQL

For MySQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
}
```

Here is an example connection string with a local MySQL database:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://janedoe:mypassword@localhost:3306/notesapi"
}
```

### Microsoft SQL Server

Here is an example connection string with a local Microsoft SQL Server database:

```prisma
datasource db {
  provider = "sqlserver"
  url      = "sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
}
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = "mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
}
```

</details>

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- Share your feedback on the [Prisma Discord](https://pris.ly/discord/)
- Create issues and ask questions on [GitHub](https://github.com/prisma/prisma/)


