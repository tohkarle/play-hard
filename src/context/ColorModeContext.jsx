import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { createContext, useContext, useMemo, useState } from "react";

const ColorModeContext = createContext({toggleColorMode: () => { }});

export const ColorModeContextProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={{ theme, toggleColorMode }}>
            {children}
        </ColorModeContext.Provider>
    )
}

export const useThemeContext = () => {
    return useContext(ColorModeContext);
}