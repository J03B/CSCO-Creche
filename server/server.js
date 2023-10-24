const express = require("express");
const { ApolloServer } = require("apollo-server-express");
// @ts-ignore
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const cors = require("cors");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const dotenv = require('dotenv');
const result = dotenv.config({ path: "../.ENV"});
if (result.error) {
  throw (result.error);
}

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: authMiddleware,
});

app.use(cors());
app.use(graphqlUploadExpress()); // To handle file uploads
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    /** We will use this next bit once we get the domain name transfered over 
    if (req.headers.host === 'https://cs-creche-079a870b912e.herokuapp.com/') {
      return res.redirect(301, 'https://www.coloradospringscreche.net');
    }
    */
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
  }
  return next();
});

// Serve up static assets
app.use("/images", express.static(path.join(__dirname, "../client/images")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
