import React from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ToolBarNew from '../../components/ToolBarNew';
import { useThemeContext } from '../../context/ColorModeContext';



const Settings = () => {

    const navigate = useNavigate();
    const { theme, toggleColorMode } = useThemeContext();
    const toggleTheme = () => {
        toggleColorMode();
        document.documentElement.classList.toggle("dark");
    }

    return (
        <div className="pt-[env(safe-area-inset-top)] text-black dark:text-white">
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