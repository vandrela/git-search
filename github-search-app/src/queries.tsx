import { gql } from "@apollo/client";

export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($searchTerm: String!) {
    search(query: $searchTerm, type: REPOSITORY, first: 10) {
      nodes {
        ... on Repository {
          name
          description
          url
        }
      }
    }
  }
`;
