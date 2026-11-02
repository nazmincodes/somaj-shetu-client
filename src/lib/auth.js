import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Re-use one Mongo connection across hot reloads / serverless invocations
const globalForMongo = globalThis;
const client = globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI);
globalForMongo._mongoClient = client;
const db = client.db(process.env.MONGODB_DB);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  // jwt() lets the Express server verify users via /api/auth/jwks
  plugins: [jwt(), nextCookies()],
});
