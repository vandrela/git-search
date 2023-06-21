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
      {/* was done just for test ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ */}
      <div>
        <hr />
        <h2>Repositories react</h2>
        <ul>
          {data.search.nodes.map((repo: any) => (
            <li key={repo.name}>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p>{repo.description}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ */}
    </div>
  );
}

export default App;
