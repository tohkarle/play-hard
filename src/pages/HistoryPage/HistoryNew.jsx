import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import ToolBarNew from "../../components/ToolBarNew";
import { UserAuth } from "../../context/AuthContext";

import { browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { txtDB } from "../../firebase";

import ActivityCard from "../../components/ActivityCard";
import ViewActivityModal from "./ViewActivityModal";

import { Tab } from '@headlessui/react'

const HistoryNew = () => {

    const { user } = UserAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState(state?.activeTab || 0);

    const [userActivities, setUserActivities] = useState([]);
    const [joinedActivities, setJoinedActivities] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    // get user details 
    useEffect(() => {
        const fetchAuthentication = () => {
            try {
                const auth = getAuth();
                // Set session persistence
                setPersistence(auth, browserSessionPersistence)
                    .then(() => {
                        // get activity details
                        const fetchActivities = async () => {
                            try {
                                const collectionRef = collection(txtDB, "Activities");
                                const snapshot = await getDocs(query(collectionRef, orderBy("activityData.createdDate", "desc")));
                                let temp = [];
                                snapshot.docs.forEach((doc) => {
                                    temp.push({ ...doc.data() });
                                });

                                let tempUserActivities = [];
                                temp.forEach((activity) => {
                                    if (activity.username.includes(user?.uid)) {
                                        tempUserActivities.push(activity);
                                    }
                                });
                                setUserActivities(tempUserActivities);

                                let tempJoinedActivities = [];
                                temp.forEach((activity) => {
                                    if (activity.activityData.joinedUsers.includes(user?.uid)) {
                                        tempJoinedActivities.push(activity);
                                    }
                                });
                                setJoinedActivities(tempJoinedActivities);
                            } catch (error) {
                                console.log("Error getting documents: ", error);
                            }
                        };
                        fetchActivities();
                    })
                    .catch(error => {
                        console.log("Error setting persistence: ", error);
                    });
            } catch (error) {
                console.log("Error getting credentials: ", error);
            }
        };
        fetchAuthentication();
    }, []);

    const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        navigate("/editactivity", { state: { activity: activity } });
    };

    const handleViewClick = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    }

    return (
        <div className="text-black dark:text-white">
            <div className="p-4">
                <div className="flex items-center mb-2">
                    <p className="text-2xl font-semibold">History</p>
                    {user.uid === "SyAJbyX2bGg9UjXEWYgvVEKkj4z2" &&
                        <p className="bg-blue-200 ml-2 text-blue-900 text-xs px-2 rounded-sm">Admin</p>
                    }
                </div>
                <p>Here you can find all the activities you have created and joined</p>
            </div>
            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                <Tab.List className="flex space-x-5 px-5">
                    <Tab
                        className={`mb-4 w-full focus:outline-none text-sm focus:border-transparent ${activeTab == 0 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"}`}
                        onClick={() => { setActiveTab("created") }}
                    >Created Activites
                    </Tab>
                    <Tab
                        className={`mb-4 w-full focus:outline-none text-sm focus:border-transparent ${activeTab == 1 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"}`}
                        onClick={() => { setActiveTab("joined") }}
                    >Joined Activities
                    </Tab>
                </Tab.List>
                <Tab.Panels className="pb-28">
                    <Tab.Panel>
                        {userActivities.length > 0 ? (
                            <div className="">
                                {userActivities.map((activity, index) => (
                                    <ActivityCard key={index} activity={activity} index={index} handleClick={handleEditClick} />
                                ))}
                            </div>
                        ) : (
                            <div className='w-full'>
                                <p className="mt-9 text-center text-xl font-semibold text-black dark:text-white">
                                    No activity found
                                </p>
                            </div>
                        )}
                    </Tab.Panel>
                    <Tab.Panel>
                        {joinedActivities.length > 0 ? (
                            <div className="history_activities">
                                {joinedActivities.map((activity, index) => (
                                    <ActivityCard key={index} activity={activity} index={index} handleClick={handleViewClick} />
                                ))}
                            </div>
                        ) : (
                            <div className='w-full'>
                                <p className="mt-9 text-center text-xl font-semibold text-black dark:text-white">
                                    No activity found
                                </p>
                            </div>
                        )}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <ViewActivityModal showModal={showModal} setShowModal={setShowModal} selectedActivity={selectedActivity} joinedActivities={joinedActivities} setJoinedActivities={setJoinedActivities} />
            <ToolBarNew />
        </div>
    );
};

export default HistoryNew;
