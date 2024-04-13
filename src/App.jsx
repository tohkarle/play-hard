import React from "react";
import Mobile from "./Mobile";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useThemeContext } from "./context/ColorModeContext";

const App = () => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <Mobile />
    </ThemeProvider>
  )
};

export default App;