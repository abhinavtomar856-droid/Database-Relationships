# Database Relationships (Mongoose + MongoDB)

Practice project where I learned how to **design a MongoDB database based on the amount of data**, how to connect collections using Mongoose, and how to use **Mongoose middleware** so that related data is deleted automatically.

## Concepts Covered

### 1. One-to-Few: embed the data
When a parent has only a **few** children, store them **inside** the parent document.

A user has a few addresses, so the addresses live in an array inside the user (`userSchema.js`):

```javascript
addresses: [
    { _id: false, location: String, city: String }
]
```

`_id: false` stops Mongoose from creating an id for every address.

### 2. One-to-Many: store references
When a parent has **many** children, keep them in their own collection and store their ids.

A customer has many orders, so the customer stores an array of order ids (`customer.js`):

```javascript
orders: [{ type: Schema.Types.ObjectId, ref: "order" }]
```

### 3. One-to-Squillions: the child stores the parent's id
When the number of children can be huge, the **child** stores the id of its parent.

Each post stores the id of the user who wrote it (`posts.js`):

```javascript
user: { type: Schema.Types.ObjectId, ref: "User" }
```

### 4. Populate
`populate()` replaces the stored ids with the actual documents.

```javascript
await Post.find({}).populate("user");
```

### 5. Mongoose Middleware: delete related data automatically
A **post middleware** on `findOneAndDelete` runs after a customer is deleted. It deletes all of that customer's orders, so no orphan data is left in the other collection (`customer.js`):

```javascript
customerSchema.post("findOneAndDelete", async (custdata) => {
    if (custdata.orders.length) {
        let res = await order.deleteMany({ _id: { $in: custdata.orders } });
        console.log(res);
    }
});
```

## How to Choose a Design

| Situation | Design | Example in this project |
|-----------|--------|-------------------------|
| A few children, always read with the parent | Embed inside the parent | User and addresses |
| Many children | Separate collection, parent stores child ids | Customer and orders |
| Huge number of children | Separate collection, child stores parent id | User and posts |

## Files

| File | What it shows |
|------|---------------|
| `Models/userSchema.js` | One-to-few with embedded addresses |
| `Models/customer.js` | One-to-many with order references and the delete middleware |
| `Models/posts.js` | Child-to-parent reference and `populate()` |

## Tech Stack

- Node.js
- MongoDB (local database named `relation`)
- Mongoose

## Project Structure

```
Database Relationships/
├── Models/
│   ├── userSchema.js
│   ├── customer.js
│   └── posts.js
├── package.json
└── README.md
```

## How to Run a File

1. Install the packages
   ```bash
   npm install
   ```
2. Start MongoDB on your machine
3. Run any file
   ```bash
   node Models/customer.js
   ```

## What I Learned

- Designing a schema based on how much related data there will be
- Embedding versus referencing in MongoDB
- Connecting collections with `ObjectId` and `ref`
- Reading related documents with `populate()`
- Why the `ref` must match the model name
- Writing a post middleware to cascade a delete across collections
- The middleware must be defined **before** `mongoose.model()` is created
- That `findByIdAndDelete` triggers the `findOneAndDelete` middleware

## Future Improvements

- Add a many-to-many relationship example
- Add a pre middleware example
- Use `await` so each step runs in order, and add error handling

## Author

**Abhinav Tomar**
GitHub: [@abhinavtomar856-droid](https://github.com/abhinavtomar856-droid)
