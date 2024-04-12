import React, { useState, useEffect } from "react";
import Mobile from "./Mobile";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const updateThemeColor = (isDarkMode) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
};

// Check the user's preferred color scheme on mount
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
updateThemeColor(isDarkMode);

// Listen for changes in the user's preferred color scheme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  updateThemeColor(event.matches);
});

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Mobile />
    </ThemeProvider>
  )
};

export default App;