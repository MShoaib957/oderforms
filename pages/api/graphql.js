import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import pool from "@/lib/db";

const resolvers = {
  Query: {
    hello: () => "world",
    users: async () => {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;
    },
    user: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    },
    information: async () => {
      const result = await pool.query('SELECT * FROM information');
      return result.rows;
    },
    info: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM information WHERE id = $1', [id]);
      return result.rows[0];
    },
    ordersdb: async () => {
      const result = await pool.query('SELECT * FROM ordersdb');
      return result.rows;
    },
    orderdb: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM ordersdb WHERE id = $1', [id]);
      return result.rows[0];
    },
    orders: async () => {
      const result = await pool.query('SELECT * FROM orders');
      return result.rows;
    },
    order: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      return result.rows[0];
    },
    userDetails: async () => {
      const result = await pool.query('SELECT * FROM user_details');
      return result.rows;
    },
    userDetail: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM user_details WHERE id = $1', [id]);
      return result.rows[0];
    },
    customers: async () => {
      const result = await pool.query('SELECT * FROM customers');
      return result.rows;
    },
    customer: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
      return result.rows[0];
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
      return "User created successfully";
    },
  },
};

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
  }
  type Information {
    id: ID!
    title: String!
    content: String!
    phone: String
    address: String!
  }
  type OrdersDB {
    id: ID!
    item: String!
    quantity: Int!
    price: Float!
    user_id: Int!
  }
  type Order {
    id: ID!
    customer_id: Int!
    item: String!
    quantity: Int!
    price: Float!
  }
  type UserDetails {
    id: ID!
    name: String!
    email: String!
    business_name: String!
    business_address: String!
    business_phone: String!
  }
  type Customer {
    id: ID!
    name: String!
    email: String!
    phone: String!
    address: String!
  }
  type Query {
    hello: String
    users: [User]
    user(id: ID!): User
    information: [Information]
    info(id: ID!): Information
    ordersdb: [OrdersDB]
    orderdb(id: ID!): OrdersDB
    orders: [Order]
    order(id: ID!): Order
    userDetails: [UserDetails]
    userDetail(id: ID!): UserDetails
    customers: [Customer]
    customer(id: ID!): Customer
  }
  type Mutation {
    createUser(name: String!, email: String!): String
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server);
