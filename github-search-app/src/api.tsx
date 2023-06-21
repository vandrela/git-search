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

// client.setLink(
//   new ApolloLink((operation, forward: any) => {
//     operation.setContext({
//       headers: {
//         authorization: `Bearer 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`,
//       },
//     });
//     return forward(operation);
//   })
// );

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
