import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { debounce } from "lodash";
import {
  Rating,
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
} from "@mui/material";

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

  const handleRatingChange = (repositoryName: string, rating: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((favorite) =>
        favorite.name === repositoryName ? { ...favorite, rating } : favorite
      )
    );
  };

  const FavoritesList = () => (
    <Box>
      <Typography variant="h2">Favorite Repositories</Typography>
      {favorites.length === 0 ? (
        <Typography variant="body1">
          No favorite repositories selected.
        </Typography>
      ) : (
        <List>
          {favorites.map((favorite) => (
            <ListItem
              key={favorite.name}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ minWidth: "500px" }}>{favorite.name}</Box>
              <Box>
                <Rating
                  name={favorite.name}
                  value={favorite.rating}
                  onChange={(event, newValue) =>
                    handleRatingChange(favorite.name, newValue || 0)
                  }
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRemoveFavorite(favorite.name)}
                sx={{ ml: 2, backgroundColor: "blue" }}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          marginBottom: "1rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage("search")}
        >
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCurrentPage("favorites")}
        >
          Favorites
        </Button>
      </Box>
      {currentPage === "search" && (
        <Box>
          <TextField
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            variant="outlined"
          />
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography>Error: {error.message}</Typography>}
          {data && (
            <Box sx={{ textAlign: "center" }}>
              <List>
                {data.search.nodes.map((repo: any) => (
                  <ListItem
                    key={repo.name}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.name}
                    </a>
                    <Typography>{repo.description}</Typography>
                    <Button
                      variant="contained"
                      sx={{
                        marginLeft: "1rem",
                        backgroundColor: favorites.some(
                          (favorite) => favorite.name === repo.name
                        )
                          ? "red"
                          : "green",
                      }}
                      onClick={() => handleToggleFavorite(repo.name)}
                    >
                      {favorites.some((favorite) => favorite.name === repo.name)
                        ? "Delete from Favorites"
                        : "Add to Favorites list"}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
      {currentPage === "favorites" && <FavoritesList />}
    </Box>
  );
};

export default SearchInput;
