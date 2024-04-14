import React from 'react'
import ActivityCard from '../../components/ActivityCard';

const Activities = ({ activityList, setSelectedActivity, setShowModal }) => {

    const handleClick = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

    return (
        <>
            {activityList.length > 0 ? (
                <div className='pb-28'>
                    {activityList.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} index={index} handleClick={handleClick} />
                    ))
                    }
                </div>
            ) : (
                <div className='w-full h-full'>
                    <p className="mt-9 text-center text-xl font-semibold text-black dark:text-white">
                        No activity found
                    </p>
                </div>
            )
            }

        </>
    )
}

export default Activities