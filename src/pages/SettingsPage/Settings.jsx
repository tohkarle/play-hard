import React from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ToolBarNew from '../../components/ToolBarNew';
import { useThemeContext } from '../../context/ColorModeContext';



const Settings = () => {

    const { theme, toggleColorMode } = useThemeContext();

    const updateThemeColor = (isDarkMode) => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
      };

    const toggleTheme = () => {
        const isDarkMode = theme.palette.mode === "light";
        updateThemeColor(isDarkMode);
        toggleColorMode();
        document.documentElement.classList.toggle("dark");
        document.body.style.backgroundColor = isDarkMode ? '#111827' : '#ffffff';
    }

    return (
        <div className="text-black dark:text-white">
            <p className="text-2xl font-semibold mb-2 p-4">Settings</p>
            <div className="flex items-center justify-between mx-5 font-medium">
                <div className="flex items-center">
                    Appearance
                </div>

                <button
                    onClick={toggleTheme}
                    className="bg-transparent py-0 pl-2 pr-0 border-none"
                >
                    <div className="flex items-center">
                        {theme.palette.mode}

                        {theme.palette.mode === 'dark' ? <MdDarkMode className="w-6 h-6 ml-1" /> : <MdLightMode className="w-6 h-6 ml-1" />}

                    </div>
                </button>

            </div>
            <ToolBarNew />
        </div>
    )
}

export default Settings