import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { debounce } from "lodash";
import { Rating } from "@mui/material";
import Typography from "@mui/material/Typography";

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

const MAX_RATING = 5;

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRepositories, { loading, error, data }] =
    useLazyQuery(SEARCH_REPOSITORIES);
  const [favorites, setFavorites] = useState<
    { name: string; rating: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<"search" | "favorites">(
    "search"
  );

  const debouncedSearch = debounce((searchTerm: string) => {
    searchRepositories({ variables: { searchTerm } });
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleToggleFavorite = (repositoryName: string) => {
    const existingFavorite = favorites.find(
      (favorite) => favorite.name === repositoryName
    );
    if (existingFavorite) {
      setFavorites(
        favorites.filter((favorite) => favorite.name !== repositoryName)
      );
    } else {
      setFavorites([...favorites, { name: repositoryName, rating: 0 }]);
    }
  };

  const handleRemoveFavorite = (repositoryName: string) => {
    setFavorites(
      favorites.filter((favorite) => favorite.name !== repositoryName)
    );
  };

  const FavoritesList = () => {
    const handleRatingChange = (repositoryName: string, rating: number) => {
      setFavorites((prevFavorites) =>
        prevFavorites.map((favorite) => {
          if (favorite.name === repositoryName) {
            return { ...favorite, rating };
          }
          return favorite;
        })
      );
    };

    return (
      <div>
        <h2>Favorite Repositories</h2>
        {favorites.length === 0 ? (
          <p>No favorite repositories selected.</p>
        ) : (
          <ul>
            {favorites.map((favorite) => (
              <li key={favorite.name}>
                {favorite.name}
                <div className="rating-stars">
                  <Rating
                    name={favorite.name}
                    value={favorite.rating}
                    onChange={(event, newValue) =>
                      handleRatingChange(favorite.name, newValue || 0)
                    }
                  />
                </div>
                <button onClick={() => handleRemoveFavorite(favorite.name)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => setCurrentPage("search")}>Search</button>
        <button onClick={() => setCurrentPage("favorites")}>Favorites</button>
      </div>
      {currentPage === "search" && (
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
                    {favorites.some((favorite) => favorite.name === repo.name)
                      ? "Delete from Favorites"
                      : "Add to Favorites list"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {currentPage === "favorites" && <FavoritesList />}
    </div>
  );
};

export default SearchInput;
