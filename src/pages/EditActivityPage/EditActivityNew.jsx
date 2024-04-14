import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from "../../components/Alert";
import ActivityDateTimePicker from "../NewActivityPage/ActivityDateTimePicker";
import LocationSelectorModal from "../NewActivityPage/LocationSelectorModal";

import { arrayRemove, collection, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { IoPin } from "react-icons/io5";
import { imgDB, txtDB } from "../../firebase";

import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

import { ACTIVITYTYPES } from "../../SCROLLICONS";

import { IoTrashSharp } from "react-icons/io5";
import ConfirmationDialog from "../../components/ConfirmationDialog";

import { UserAuth } from "../../context/AuthContext";

const EditActivityNew = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const activity = location.state.activity;
    const { user } = UserAuth();

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [description, setDescription] = useState(activity.activityData.description);
    const [activityType, setActivityType] = useState(activity.activityData.activityType);
    const [numberOfGuests, setNumberOfGuests] = useState(activity.activityData.numberOfGuests)
    const joinedUsers = activity.activityData.joinedUsers;
    const documentID = activity.activityData.documentID;
    const imgUrl = activity.activityData.imgUrl;
    const createdDate = activity.activityData.createdDate;

    const startDateSeconds = activity.activityData.date[0].seconds;
    const startDateNanosecond = activity.activityData.date[0].nanoseconds;
    const startdate = new Date(startDateSeconds * 1000);
    startdate.setMilliseconds(startdate.getMilliseconds() + startDateNanosecond / 1e6);

    const endDateSeconds = activity.activityData.date[1].seconds;
    const endDateNanosecond = activity.activityData.date[1].nanoseconds;
    const enddate = new Date(endDateSeconds * 1000);
    enddate.setMilliseconds(enddate.getMilliseconds() + endDateNanosecond / 1e6);

    const [date, setDate] = useState(dayjs(startdate));
    const [endDate, setEndDate] = useState(dayjs(enddate));
    const [activityDataLocation, setActivityDataLocation] = useState(activity.activityData.selectedLocation);

    let activityData = {
        date: [date.toDate(), endDate.toDate()],
        activityType: activityType,
        numberOfGuests: numberOfGuests,
        description: description,
        selectedLocation: activityDataLocation,
        joinedUsers: joinedUsers,
        documentID: documentID,
        imgUrl: imgUrl,
        createdDate: createdDate,
    };

    const handleActivityTypeChange = (event, newValue) => {
        setActivityType(newValue);
    };

    const handleActitvityUpdate = async () => {
        if (activityData.description === "") {
            setMessage("Please enter a description");
            setVisible(true);
            return false;
        }

        if (activityData.activityType === "") {
            setMessage("Please select an activity type");
            setVisible(true);
            return false;
        }

        if (activityData.numberOfGuests === "") {
            setMessage("Please enter the number of guests");
            setVisible(true);
            return false;
        }

        if (activityData.date === "") {
            setMessage("Please enter the date");
            setVisible(true);
            return false;
        }

        if (activityData.selectedLocation === null) {
            setMessage("Please enter the location of the activity");
            setVisible(true);
            return false;
        }

        setIsLoading(true);
        const activityRef = collection(txtDB, "Activities");
        const docRef = activity.documentID;

        await updateDoc(doc(activityRef, docRef), {
            activityData: activityData
        })
            .then(() => {
                console.log("Document successfully updated!");
                setIsLoading(false);
            })
            .catch((error) => {
                setMessage("Error updating activity, please try again")
                setVisible(true)
                console.error("Error updating document: ", error);
                setIsLoading(false);
            });

        navigate("/history");
    }

    const handleDeleteActivity = async () => {
        try {
            setIsDeleting(true);

            // Define the set of predefined activity type URLs
            const predefinedActivityUrls = new Set();
            ACTIVITYTYPES.forEach(activity => {
                const url = `https://firebasestorage.googleapis.com/v0/b/sc2006-group1.appspot.com/o/Imgs%2F${activity.value}.jpg`;
                predefinedActivityUrls.add(url);
            });

            if (activity.activityData.imgUrl.length < 1) {
                // Delete images from Firebase Storage
                const promises = activity.activityData.imgUrl.filter(imageUrl => {
                    // Skip deletion if the URL is a predefined activity type URL
                    return !predefinedActivityUrls.has(imageUrl);
                }).map(imageUrl => {
                    const imageRef = ref(imgDB, imageUrl);
                    return deleteObject(imageRef);
                });

                // Wait for all deletions to complete
                await Promise.all(promises);
            }

            const activityRef = doc(txtDB, "Activities", activity?.documentID);
            await deleteDoc(activityRef);

            // Update user's createdActivities array
            const userRef = collection(txtDB, 'Users');
            await updateDoc(doc(userRef, user?.uid), {
                createdActivities: arrayRemove(activity?.documentID),
            });

            // Remove activity ID from joinedUsers' joinedActivities array
            const usersCollectionRef = collection(txtDB, "Users");
            const batch = writeBatch(txtDB);

            for (const userId of activity?.activityData.joinedUsers) {
                const userDocRef = doc(usersCollectionRef, userId);
                batch.update(userDocRef, {
                    joinedActivities: arrayRemove(activity?.documentID),
                });
            }

            await batch.commit();

            console.log("Activity and associated images deleted successfully!");
            navigate("/history");
        } catch (error) {
            console.error("Error deleting activity or associated images: ", error);
            setMessage("Error deleting activity or associated images, please try again.");
            setVisible(true);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="pt-[env(safe-area-inset-top)] text-black dark:text-white">
            <p className="px-4 pt-4 text-xl font-semibold text-left">Edit Activity</p>
            <div className="px-1">
                <div className='flex mt-3 mb-4 overflow-x-auto w-full scroll-smooth'>
                    {activity.activityData.imgUrl.length > 0 ? (
                        activity.activityData.imgUrl.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt="Activity_Image"
                                className={`bg-gray-100 mb-3 ml-2.5 ${index === activity.activityData.imgUrl.length - 1 ? 'mr-2.5' : ''} ${activity.activityData.imgUrl.length > 1 ? 'w-64' : 'w-full mr-2.5'} h-44 object-cover object-center rounded-md transition-all duration-100 ease-in-out`}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center w-full h-44 mx-2.5 bg-gray-300 rounded-lg sm:w-96 dark:bg-gray-700">
                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-7 px-3">
                <TextField
                    label="Description"
                    multiline
                    fullWidth
                    rows={4}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                />

                <Autocomplete
                    disablePortal
                    freeSolo
                    options={ACTIVITYTYPES.map(activity => activity.value)}
                    renderInput={(params) => <TextField {...params} label="Activity type" />}
                    value={activityType}
                    onChange={handleActivityTypeChange}
                />

                <TextField
                    label="Number of guest"
                    fullWidth
                    inputProps={{ type: 'number' }}
                    value={numberOfGuests}
                    onChange={(e) => { setNumberOfGuests(e.target.value) }}
                />

                <ActivityDateTimePicker date={date} endDate={endDate} setDate={setDate} setEndDate={setEndDate} setMessage={setMessage} setVisible={setVisible} />

                <button className="bg-gray-100 dark:bg-gray-700 focus:border-transparent">
                    <div
                        className="flex items-center text-sm"
                        onClick={() => { setShowModal(true) }}
                    >
                        <IoPin className="mr-1" />
                        {activityDataLocation === null ? "Get Location" : activityDataLocation.SEARCHVAL}
                    </div>
                </button>

                <div className="pt-3 pb-12 flex justify-between items-center">
                    <button
                        className="ml-1 bg-transparent p-0 hover:border-transparent focus:border-transparent"
                        onClick={() => { setShowConfirmationDialog(true) }}
                    >
                        <IoTrashSharp className="text-red-500 w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <button
                            className="border-gray-700 py-2 px-3 bg-transparent dark:border-gray-400 focus:border-transparent"
                            onClick={() => navigate("/history")}
                        >
                            Cancel
                        </button>

                        <button
                            className="py-2 px-3 w-40 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleActitvityUpdate}
                        >
                            {isLoading ? (
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                </svg>
                            ) : (
                                <p>Update Activity</p>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                showConfirmationDialog={showConfirmationDialog}
                setShowConfirmationDialog={setShowConfirmationDialog}
                Icon={IoTrashSharp}
                title={"Are you sure you want to delete this activity?"}
                handleClick={handleDeleteActivity}
                isLoading={isDeleting}
                type="Destruct"
            />

            <LocationSelectorModal
                showModal={showModal}
                setShowModal={setShowModal}
                setActivityDataLocation={setActivityDataLocation}
            />

            <Alert
                visible={visible}
                setVisible={setVisible}
                message={message}
            />
        </div>
    )
}

export default EditActivityNew