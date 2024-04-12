import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { UserAuth } from "../../context/AuthContext";
import { txtDB } from "../../firebase";


import Activities from "./Activities";
import ActivityModal from "./ActivityModal";
import FilterChips from "./FilterChips";
import HeaderNew from "./HeaderNew";
import ToolBarNew from "../../components/ToolBarNew";

const LandingNew = () => {

    const { user } = UserAuth();

    const [activityList, setActivityList] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const collectionRef = collection(txtDB, "Activities");
                const snapshot = await getDocs(collectionRef);
                let temp = [];
                snapshot.docs.forEach((doc) => {
                    temp.push({ ...doc.data() });
                });
                setActivityList(temp);
                setAllActivities(temp);
            } catch (error) {
                console.log("Error getting documents: ", error);
            }
        };
        fetchActivities();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="pt-[env(safe-area-inset-top)]">
            <HeaderNew username={user.username} allActivities={allActivities} setActivityList={setActivityList} />
            <FilterChips allActivities={allActivities} activityList={activityList} setActivityList={setActivityList} />
            <Activities activityList={activityList} setSelectedActivity={setSelectedActivity} setShowModal={setShowModal} />
            <ToolBarNew />

            {/* Modal to display detailed activity information */}
            <ActivityModal showModal={showModal} setShowModal={setShowModal} selectedActivity={selectedActivity} />
        </div>
    )
};

export default LandingNew;