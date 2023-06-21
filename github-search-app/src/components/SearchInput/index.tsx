import React, { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";
import FavoritesList, { Favorite } from "../Favorites";
import { Typography, Button, Box, TextField } from "@mui/material";
import RepositoryList from "../RepositoryList";
import { SEARCH_REPOSITORIES } from "../../queries";
import "./SearchInput.css";

export interface Repository {
  name: string;
  description: string;
  url: string;
}

interface SearchData {
  search: {
    nodes: Repository[];
  };
}

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchRepositories, { loading, error, data }] =
    useLazyQuery<SearchData>(SEARCH_REPOSITORIES);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentPage, setCurrentPage] = useState<"search" | "favorites">(
    "search"
  );

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      searchRepositories({ variables: { searchTerm } });
    }, 300),
    [searchRepositories]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleToggleFavorite = useCallback((repositoryName: string) => {
    setFavorites((prevFavorites: Favorite[]) => {
      const existingFavorite = prevFavorites.find(
        (favorite) => favorite.name === repositoryName
      );
      if (existingFavorite) {
        return prevFavorites.filter(
          (favorite) => favorite.name !== repositoryName
        );
      } else {
        return [...prevFavorites, { name: repositoryName, rating: 0 }];
      }
    });
  }, []);

  const handleSearchButtonClick = useCallback(() => {
    setCurrentPage("search");
  }, []);

  const handleFavoritesButtonClick = useCallback(() => {
    setCurrentPage("favorites");
  }, []);

  return (
    <Box className="container">
      <Box className="buttonContainer">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchButtonClick}
        >
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFavoritesButtonClick}
        >
          Favorites
        </Button>
      </Box>
      {currentPage === "search" && (
        <Box>
          <TextField
            className="textField"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            variant="outlined"
          />
          {loading ? (
            <Typography className="loadingText">Loading...</Typography>
          ) : error ? (
            <Typography className="errorText">
              Error: {error.message}
            </Typography>
          ) : (
            data?.search?.nodes && (
              <RepositoryList
                repositories={data.search.nodes}
                favorites={favorites}
                handleToggleFavorite={handleToggleFavorite}
              />
            )
          )}
        </Box>
      )}
      {currentPage === "favorites" && (
        <FavoritesList
          favorites={favorites}
          handleChangeFavorites={setFavorites}
        />
      )}
    </Box>
  );
};

export default SearchInput;
