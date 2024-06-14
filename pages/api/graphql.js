import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import pool from "@/lib/db";
// console.log("Imported pool:", { pool });
const resolvers = {
  Query: {
    hello: () => "world",
    users: async () => {
      const user = await pool("users").select("*");
      return user;
    },
    user: async (_, { id }) => {
      return await pool("users").where({ id }).first();
    },
    information: async () => {
      return await pool("information").select("*");
    },
    info: async (_, { id }) => {
      return await pool("information").where({ id }).first();
    },
    ordersdb: async () => {
      try {
        const result = await pool.query("SELECT * FROM ordersdb");
        return result.rows;
      } catch (err) {
        console.error("Error querying ordersdb:", err);
        throw new Error("Failed to fetch ordersdb");
      }
    },
    orderdb: async (_, { id }) => {
      try {
        const result = await pool.query(
          "SELECT * FROM ordersdb WHERE id = $1",
          [id]
        );
        return result.rows[0];
      } catch (err) {
        console.error("Error querying ordersdb:", err);
        throw new Error("Failed to fetch orderdb");
      }
    },
    orders: async () => {
      return await pool("orders").select("*");
    },
    order: async (_, { id }) => {
      return await pool("orders").where({ id }).first();
    },
    userDetails: async () => {
      return await pool("user_details").select("*");
    },
    userDetail: async (_, { id }) => {
      return await pool("user_details").where({ id }).first();
    },
    customers: async () => {
      return await pool("customers").select("*");
    },
    customer: async (_, { id }) => {
      return await pool("customers").where({ id }).first();
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      // const [user] = await db('users').insert({ name, email }).returning('*');
      return "mutaion working";
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
