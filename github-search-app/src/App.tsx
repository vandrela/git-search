import { useQuery, gql } from "@apollo/client";
import { Box, Typography } from "@mui/material";
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
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h1">Github Search Interface</Typography>
      <SearchInput />
    </Box>
  );
}

export default App;
