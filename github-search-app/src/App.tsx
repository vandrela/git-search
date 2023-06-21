import "./App.css";
import { useQuery, gql } from "@apollo/client";
import SearchInput from "./SearchInput";

const GET_REPOSITORIES = gql`
  query GetRepositories {
    search(query: "react", type: REPOSITORY, first: 10) {
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

function App() {
  const { loading, error, data } = useQuery(GET_REPOSITORIES);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <h1>Github Search Interface</h1>
      <SearchInput />
    </div>
  );
}

export default App;
