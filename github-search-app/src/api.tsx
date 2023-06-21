import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
});

client.setLink(
  ApolloLink.from([
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: `Bearer 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`,
        },
      });
      return forward(operation);
    }),
    new HttpLink({ uri: "https://api.github.com/graphql" }),
  ])
);

export default client;
