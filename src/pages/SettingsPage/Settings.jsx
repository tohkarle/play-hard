import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { IoChevronDownOutline, IoInvertMode } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import ToolBarNew from '../../components/ToolBarNew';
import { useThemeContext } from '../../context/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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

                <div className="flex items-center">
                    {theme.palette.mode}
                    <button
                        onClick={toggleTheme}
                        className="bg-transparent py-0 pl-2 pr-0 border-none"
                    >
                        {theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </button>
                </div>

            </div>
            <ToolBarNew />
        </div>
    )
}

export default Settings