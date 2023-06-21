import React from "react";
import { Box, List, ListItem, Typography, Button } from "@mui/material";
import { Favorite } from "../Favorites";
import { Repository } from "../SearchInput";
import "./RepositoryList.css";

const RepositoryList = ({
  repositories,
  favorites,
  handleToggleFavorite,
}: {
  repositories: Repository[];
  favorites: Favorite[];
  handleToggleFavorite: (repositoryName: string) => void;
}) => (
  <Box className="container">
    <Typography variant="h2" className="heading">
      GitHub Repositories
    </Typography>
    <List className="list">
      {repositories.map((repo) => (
        <ListItem key={repo.name} className="listItem">
          <a
            className="listItemBlock"
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {repo.name}
          </a>
          <Typography className="listItemBlock">{repo.description}</Typography>
          <Button
            variant="contained"
            className={`favoriteButton ${
              favorites.some((favorite) => favorite.name === repo.name)
                ? "delete"
                : "add"
            } listItemBlock`}
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
);

export default RepositoryList;
