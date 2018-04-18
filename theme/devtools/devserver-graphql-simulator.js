const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const graphqlHTTP = require('express-graphql');
const { URL } = require('url');

const urlResolverSchemaString = `

type EntityUrl @doc(description: "EntityUrl is an output object containing the \`id\`, \`canonical_url\`, and \`type\` attributes") {
    id: Int @doc(description: "The ID assigned to the object associated with the specified url. This could be a product ID, category ID, or page ID.")
    canonical_url: String @doc(description: "The internal relative URL. If the specified  url is a redirect, the query returns the redirected URL, not the original.")
    type: String @doc(description: "One of PRODUCT, CATEGORY, or CMS_PAGE.")
}

type Query {
    urlResolver(url: String!): EntityUrl @doc(description: "The urlResolver query returns the canonical URL for a specified product, category or CMS page")
}

`

module.exports = (devServer, getPageType) => {
  const urlResolverSchema = makeExecutableSchema({ typeDefs: urlResolverSchemaString });
  addMockFunctionsToSchema({
    schema: urlResolverSchema,
    mocks: {
      String: (root, args, req) => getPageType(root, args, new URL(req.headers.referer))
    }
  });

  const existing = (typeof devServer.before === "function") ? devServer.before : () => {};
  devServer.before = app => {
    app.use('/graphql', graphqlHTTP({
      schema: urlResolverSchema,
      graphiql: true
    }));
    existing(app);
  }
}