// server.js -- the GraphQL API

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const pool = require("./db");

// 1. the schema: what the API offers
const typeDefs = `#graphql 
 type Author { 
 id: ID! 
 name: String! 
 country: String 
 books: [Book!]! 
 } 
 type Book { 
 id: ID! 
 title: String! 
 year: Int 
 author: Author! 
 } 
 type Query { 
 authors: [Author!]! 
 author(id: ID!): Author 
 books: [Book!]! 
 } 
 type Mutation { 
 addBook(title: String!, year: Int, authorId: ID!): Book! 
 } 
`;

// 2. the resolvers: how each field gets its data from postgreSQL
const resolvers = {
  Query: {
    authors: async () => {
      const {rows} = await pool.query("SELECT * FROM authors");
      return rows;
    },
    author: async (_parent, { id }) => {
      const {rows} = await pool.query("SELECT * FROM authors WHERE id = $1", [
        id,
      ]);
      return rows[0];
    },
    books: async () => {
      const {rows} = await pool.query("SELECT * FROM books");
      return rows;
    },
  },

  
  // relationship fields -- these are the ones you must write
  Author: {
    books: async (author) => {
      const {rows} = await pool.query(
        "SELECT * FROM books WHERE author_id = $1",
        [author.id],
      );
      return rows;
    },
  },
  Book: {
    author: async (book) => {
      const {rows} = await pool.query("SELECT * FROM authors WHERE id = $1", [
        book.author_id,
      ]);
      return rows[0];
    },
  },
  Mutation: {
    addBook: async (_parent, { title, year, authorId }) => {
      const { rows } = await pool.query(
        "INSERT INTO books (title, year, author_id) VALUES ($1, $2, $3) RETURNING *",
        [title, year, authorId],
      );
      return rows[0];
    },
  },
};

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`GraphQL API ready at ${url}`);
}
start();
