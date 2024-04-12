import React from "react";
import { useNavigate } from 'react-router-dom';
import { IoHome, IoTimerSharp, IoAdd, IoSettingsSharp, IoPersonCircleSharp } from "react-icons/io5";

const ToolBarNew = () => {

    const navigate = useNavigate();

    return (
        <div className="fixed z-10 h-16 bg-white border border-gray-200 rounded-full bottom-7 left-3 right-3 dark:bg-gray-700 dark:border-gray-600 shadow-md">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                <button 
                type="button" 
                className="bg-transparent inline-flex flex-col items-center justify-center rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group focus:outline-none"
                onClick={() => navigate("/home")}
                >
                    <IoHome className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                </button>

                <button 
                type="button" 
                className="bg-transparent inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group focus:outline-none"
                onClick={() => navigate("/history")}
                >
                    <IoTimerSharp className="w-7 h-7 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                </button>

                <div className="flex items-center justify-center">
                    <button 
                    type="button" 
                    className="inline-flex items-center justify-center p-2.5 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => navigate("/newactivity")}
                    >
                        <IoAdd className="w-7 h-7 text-white" />
                    </button>
                </div>

                <button 
                type="button" 
                className="bg-transparent inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group focus:outline-none"
                >
                    <IoSettingsSharp className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                </button>

                <button 
                type="button" 
                className="bg-transparent inline-flex flex-col items-center justify-center rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group focus:outline-none"
                onClick={() => navigate("/profile")}
                >
                    <IoPersonCircleSharp className="w-7 h-7 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                </button>

            </div>
        </div>
    )
};

export default ToolBarNew;