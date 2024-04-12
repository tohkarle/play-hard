import React from 'react';
import { IoMdPeople } from "react-icons/io";
import { IoChevronForwardOutline } from "react-icons/io5";

const ActivityCard = ({ activity, index, handleClick }) => {

    return (
        <div className="px-3 mb-5 select-none active:scale-[0.98] transform-gpu transition-all ease-in-out duration-200">
            <div key={index} className="w-full bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                {activity.activityData.imgUrl.length > 0 ? (
                    <img className="w-full h-40 object-cover rounded-t-lg" src={activity.activityData.imgUrl} alt="" />
                ) : (
                    <div className="flex items-center justify-center w-full h-40 bg-gray-300 rounded-t-lg sm:w-96 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                )}
                <div
                    className="py-3 pl-4 pr-3 flex justify-between items-center"
                    onClick={() => handleClick(activity)}
                >
                    <div>
                        <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">{activity.activityData.description}</h5>
                        <div className="mb-1 flex items-center text-blue-600">
                            <IoMdPeople />
                            <p className="pl-1 text-xs font-medium">{activity.activityData.joinedUsers.length + 1} joined</p>
                            {activity.activityData.joinedUsers.length >= activity.activityData.numberOfGuests &&
                                <p className="bg-blue-200 ml-2 text-blue-900 text-xs px-2 rounded-sm">full</p>
                            }
                        </div>
                    </div>
                    <IoChevronForwardOutline className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}

export default ActivityCard