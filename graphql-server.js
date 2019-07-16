const { ApolloServer, gql } = require('apollo-server');

const { loggerFactory } = require('./logger-factory');
const { uploadGraphqlFile } = require('./upload-client');
const uploadServerConfig = require('./upload-server-config');

const PORT = 4000;

const start = () => {
  const logger = loggerFactory('graphql');

  // GraphQL schema
  const typeDefs = gql(`

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Query {
        uploads: [File]
    }

    type Mutation {
      uploadFiles(
        file1: Upload
        file2: Upload
      ): Boolean
    }
  `);

  const url = uploadServerConfig.url();

  // Root resolver
  const resolvers = {
    Mutation: {
      uploadFiles: async (_, { file1, file2 }) => {
        logger.info('uploadFiles mutation start (upload server url: %s)', url);
        try {
          const promises = Promise.all([
            uploadGraphqlFile({
              url,
              id: 'file1',
              file: file1,
              logger: loggerFactory('upload-client')
            }),
            uploadGraphqlFile({
              url,
              id: 'file2',
              file: file2,
              logger: loggerFactory('upload-client')
            })
          ]);
          logger.info('uploadFiles await promises start');
          const result = await promises;
          logger.info('uploadFiles await promises end');

          logger.info('uploadFiles mutation end: %o', result);
          return true;
        } catch (error) {
          logger.error('error with mutation: %o', error);
          return false;
        }
      }
    }
  };

  // Create an express server and a GraphQL endpoint
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen(PORT).then(({ url }) => {
    logger.info(`🚀  Server ready at ${url}`);
  });
};

start();
