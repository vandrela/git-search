import { Box, Typography } from "@mui/material";
import SearchInput from "./components/SearchInput/index";

function App() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h1">Github Search Interface</Typography>
      <SearchInput />
    </Box>
  );
}

export default App;
