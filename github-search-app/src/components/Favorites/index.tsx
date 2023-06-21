import { Box, Typography, List, ListItem, Rating, Button } from "@mui/material";
import "./FavoritesList.css";

export interface Favorite {
  name: string;
  rating: number;
}

interface FavoritesListProps {
  favorites: Favorite[];
  handleChangeFavorites: (favorites: Favorite[]) => void;
}

const FavoritesList = ({
  favorites,
  handleChangeFavorites,
}: FavoritesListProps) => {
  const handleRatingChange = (repositoryName: string, rating: number) => {
    const updatedFavorites = favorites.map((favorite) =>
      favorite.name === repositoryName ? { ...favorite, rating } : favorite
    );
    handleChangeFavorites(updatedFavorites);
  };

  const handleRemoveFavorite = (repositoryName: string) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.name !== repositoryName
    );
    handleChangeFavorites(updatedFavorites);
  };

  return (
    <Box className="container">
      <Typography variant="h2" className="heading">
        Favorite Repositories
      </Typography>
      {favorites.length === 0 ? (
        <Typography variant="body1" className="noFavoritesText">
          No favorite repositories selected.
        </Typography>
      ) : (
        <List className="list-favorites">
          {favorites.map((favorite) => (
            <ListItem key={favorite.name} className="listItem">
              <Box className="repositoryName">{favorite.name}</Box>
              <Box>
                <Rating
                  className="rating"
                  name={favorite.name}
                  value={favorite.rating}
                  onChange={(_event, newValue) =>
                    handleRatingChange(favorite.name, newValue || 0)
                  }
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRemoveFavorite(favorite.name)}
                className="removeButton"
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FavoritesList;
