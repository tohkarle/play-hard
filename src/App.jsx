import React, { useState, useEffect } from "react";
import Mobile from "./Mobile";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    // Set initial height
    setHeight(window.innerHeight);

    window.addEventListener("resize", handleWindowResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []); // Empty dependency array to run the effect only once during mount

  // Return both width and height
  return { width, height };
};

const App = () => {
  const { width, height } = useViewport();
  const width_breakpoint = 768;
  const height_breakpoint = 512;

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