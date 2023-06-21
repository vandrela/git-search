import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { debounce } from "lodash";

const SEARCH_REPOSITORIES = gql`
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

const SearchInput: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRepositories, { loading, error, data }] =
    useLazyQuery(SEARCH_REPOSITORIES);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Debounce the search function to avoid excessive API calls
  const debouncedSearch = debounce((searchTerm: string) => {
    searchRepositories({ variables: { searchTerm } });
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleToggleFavorite = (repositoryName: string) => {
    if (favorites.includes(repositoryName)) {
      setFavorites(favorites.filter((favorite) => favorite !== repositoryName));
    } else {
      setFavorites([...favorites, repositoryName]);
    }
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.search.nodes.map((repo: any) => (
            <li key={repo.name}>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p>{repo.description}</p>
              <button onClick={() => handleToggleFavorite(repo.name)}>
                {favorites.includes(repo.name)
                  ? "Unmark as Favorite"
                  : "Mark as Favorite"}
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Favorite Repositories</h2>
      <ul>
        {favorites.map((favorite: string) => (
          <li key={favorite}>{favorite}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchInput;
