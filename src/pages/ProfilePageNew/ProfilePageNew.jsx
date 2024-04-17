/**
 * The ProfilePage component serves as a personal dashboard for users, showcasing their profile information
 * including username, profile picture, activities they've created, and activities they've joined. It provides
 * an interactive and intuitive interface for users to engage with their data and navigate through their participation
 * within the application. Users can also edit their profile information and log out from this page.
 *
 * This component performs real-time data fetching from Firebase Firestore to retrieve and display the user's activities
 * and leverages Firebase Authentication for user information and Firebase Storage for profile picture management.
 * The use of Firebase's comprehensive suite demonstrates a seamless integration of authentication, database, and storage
 * services within a React application. Furthermore, the component supports responsive design, adjusting its layout
 * based on the provided `width` and `height` props to ensure a consistent user experience across various devices.
 *
 * @component ProfilePage
 * @param {Object} props - Properties passed to the component for dynamic styling and functionality.
 * @param {number} props.width - The width of the component, utilized for responsive styling.
 * @param {number} props.height - The height of the component, also used for responsive design purposes.
 *
 * @returns {JSX.Element} Renders a user's profile page displaying personal information, activities created,
 * activities joined, and options to edit the profile or log out. It provides a personalized user experience
 * by integrating user data management and display functionalities in a single, cohesive interface.
 */

import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { UserAuth } from "../../context/AuthContext";

import { FaPhoneAlt } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";
import { IoEllipsisVertical, IoMail } from "react-icons/io5";
import ToolBarNew from "../../components/ToolBarNew";

import { Menu, Transition } from '@headlessui/react';

import { IoExitOutline } from "react-icons/io5";
import ConfirmationDialog from '../../components/ConfirmationDialog';

/**
 * Formats a timestamp into a human-readable date string.
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return dateObject.toLocaleDateString('en-UK', options);
};

const ProfilePageNew = () => {

    const { user, logout } = UserAuth();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            logout();
            navigate('/');
            setIsLoading(false);
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    };

    return (
        <div className="text-black dark:text-white pt-[env(safe-area-inset-top)]">
            <div className="px-4 pt-4 flex justify-between items-center">
                <p className="text-2xl font-semibold mb-2">Profile</p>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="bg-transparent hover:text-gray-400 p-0 focus:border-transparent hover:border-transparent focus:outline-none">
                            <IoEllipsisVertical className="w-5 h-5" />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-52 p-1.5 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 divide-dashed rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    <div>
                                        <a
                                            className="mb-1 hover:no-underline text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 group flex w-full items-center rounded-md px-3 py-2"
                                            onClick={() => { navigate("/editprofile") }}
                                        >
                                            Edit profile
                                        </a>
                                    </div>
                                </Menu.Item>
                            </div>
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    <a
                                        className="hover:no-underline mt-1 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-400 group flex w-full items-center rounded-md px-3 py-2"
                                        onClick={() => { setShowConfirmationDialog(true) }}
                                    >
                                        Logout
                                    </a>
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="px-4 pb-10 pt-3 flex flex-col items-center">
                <img className="w-24 h-24 object-cover mb-3 rounded-full" src={user?.profileImageUrl || "https://www.w3schools.com/howto/img_avatar.png"} alt="Profle image" />
                {user?.fullName &&
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user?.fullName}</h5>
                }
                <span className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</span>

                <div className="divide-x-2 divide-dashed dark:divide-gray-700 mt-6 w-full h-32 max-w-sm flex items-center justify-center bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-1/2 space-y-1">
                        <p className="w-full text-center text-2xl font-bold">{user?.createdActivities?.length ? user?.createdActivities?.length : 0}</p>
                        <p className="w-full text-sm text-center text-gray-500">Activies Created</p>
                    </div>
                    <div className="w-1/2 space-y-1">
                        <p className="w-full text-center text-2xl font-bold">{user?.joinedActivities?.length ? user?.joinedActivities?.length : 0}</p>
                        <p className="w-full text-sm text-center text-gray-500">Activies Joined</p>
                    </div>
                </div>

                <div className="px-4 pt-4 pb-3 mt-6 w-full max-w-sm bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                    <p className="mb-3 w-full text-left font-bold">About</p>
                    {user?.bio &&
                        <p className="mb-3 w-full text-left">{user?.bio}</p>
                    }
                    <div className="mb-2.5 flex items-center">
                        <IoMail className="w-5 h-5" />
                        <p className="ml-2">{user?.email}</p>
                    </div>
                    {user?.telegramUsername &&
                        <div className="mb-2.5 flex items-center">
                            <BsTelegram className="w-5 h-5" />
                            <p className="ml-2">@{user?.telegramUsername}</p>
                        </div>
                    }
                    {user?.mobileNumber &&
                        <div className="mb-2.5 flex items-center">
                            <FaPhoneAlt className="w-5 h-5" />
                            <p className="ml-2">{user?.mobileNumber}</p>
                        </div>
                    }
                </div>
            </div>

            <ConfirmationDialog
                showConfirmationDialog={showConfirmationDialog}
                setShowConfirmationDialog={setShowConfirmationDialog}
                Icon={IoExitOutline}
                title={"Are you sure you want to logout?"}
                handleClick={handleLogout}
                isLoading={isLoading}
                type="Destruct"
            />
            <ToolBarNew />
        </div>
    );
};

export default ProfilePageNew;