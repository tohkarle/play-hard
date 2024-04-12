import { useState, useRef } from 'react';
import { SCROLLICONS } from "../../assets/components/LandingPage/SCROLLICONS";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterChips = ({ allActivities, activityList, setActivityList }) => {

    const containerRef = useRef();

    const [selectedFilter, setSelectedFilter] = useState(-1);

    const handleIconFilter = (item) => {
        if (selectedFilter == item.id && allActivities.length > activityList.length) {
            setActivityList(allActivities);
            setSelectedFilter(-1)
        } else {
            const filteredActivities = allActivities.filter((activity) => activity.activityData.activityType === item.desc);
            setActivityList(filteredActivities);
            setSelectedFilter(item.id)
        }
    };

    return (
        <div className='flex overflow-x-auto w-full px-3 mt-2 mb-4' ref={containerRef}>
            {SCROLLICONS.map((item, index) => (
                <div key={index}>
                    {selectedFilter === item.id ? (
                        <button
                            type="button"
                            className="text-white bg-black dark:bg-white dark:text-black rounded-lg text-xs px-3 text-center inline-flex items-center me-2 hover:border-transparent focus:border-transparent focus:outline-none"
                            onClick={() => handleIconFilter(item)}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            <p className="pl-1 whitespace-nowrap">{item.desc}</p>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="text-gray-900 bg-gray-100 hover:bg-gray-20 dark:bg-slate-800 dark:text-white rounded-lg text-xs px-3 text-center inline-flex items-center me-2 hover:border-transparent focus:border-transparent focus:outline-none"
                            onClick={() => handleIconFilter(item)}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            <p className="pl-1 whitespace-nowrap">{item.desc}</p>
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default FilterChips