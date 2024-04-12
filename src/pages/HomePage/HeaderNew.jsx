import React, { useState } from "react";
import logo from '../../assets/images/play.png';
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

const HeaderNew = ({ username, allActivities, setActivityList }) => {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        const filteredActivities = allActivities.filter(activity => {
            return (
                activity.activityData.activityType.toLowerCase().includes(event.target.value.toLowerCase()) ||
                activity.activityData.description.toLowerCase().includes(event.target.value.toLowerCase())
            );
        });
        setActivityList(filteredActivities);
    };

    const clearSearchText = () => {
        setSearchQuery("");
        setActivityList(allActivities);
    }

    return (
        <nav className="border-gray-200 dark:bg-gray-900 w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-3 py-2">
                <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-20" alt="logo" />
                </a>
                <h3 className="w-full text-xl font-semibold pb-3">Welcome back, {username}!</h3>
                <div className="relative w-full">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoSearchOutline className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    {searchQuery != "" &&
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                            <button
                                className="bg-transparent p-0"
                                onClick={() => clearSearchText()}>
                                <IoCloseOutline className="text-gray-500 w-4 h-4" />
                            </button>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
};

export default HeaderNew;