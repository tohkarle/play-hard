import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Alert from "../../components/Alert";
import { UserAuth } from "../../context/AuthContext";
import ActivityDateTimePicker from "./ActivityDateTimePicker";
import ImagePicker from "./ImagePicker";
import LocationSelectorModal from "./LocationSelectorModal";

import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IoPin } from "react-icons/io5";
import { imgDB, txtDB } from "../../firebase";

import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { ACTIVITYTYPES } from "../../SCROLLICONS";

import { v4 } from "uuid";

const NewActivityNew = () => {

    const navigate = useNavigate();
    const { user } = UserAuth();

    //create array to record joined users
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [documentID, setDocumentID] = useState("");

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [file, setFile] = useState([]);
    const [description, setDescription] = useState("");
    const [activityType, setActivityType] = useState("Running");
    const [numberOfGuests, setNumberOfGuests] = useState("")
    const [date, setDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(date);
    const [activityDataLocation, setActivityDataLocation] = useState(null);
    const [img, setImg] = useState([]);

    // Activity creation (firebase)
    let activityData = {
        date: [date.toDate(), endDate.toDate()],
        activityType: activityType,
        numberOfGuests: numberOfGuests,
        description: description,
        selectedLocation: activityDataLocation,
        joinedUsers: joinedUsers,
        documentID: documentID,
        imgUrl: img,
        createdDate: new Date()
    };

    const handleActivityTypeChange = (event, newValue) => {
        setActivityType(newValue);
        console.log("newValue: ", newValue);
    };

    // function to get image from firebase imgDB
    const getImage = async (img) => {
        const url = await getDownloadURL(ref(imgDB, img));
        return url;
    };

    const uploadImages = () => {
        return new Promise((resolve, reject) => {
            if (file.length < 1) {
                getImage(`Imgs/${activityType}.jpg`)
                    .then(val => {
                        console.log(val, "val");
                        setImg([val]);
                        activityData.imgUrl = [val];
                        resolve();
                    })
                    .catch(error => reject(error));
            } else {
                let urls = [];

                const uploadTasks = file.map((imageFile) => {
                    const imgRef = ref(imgDB, `Imgs/${v4()}`);
                    return uploadBytes(imgRef, imageFile)
                        .then(data => getDownloadURL(data.ref))
                        .then(val => {
                            console.log("val: ", val);
                            urls.push(val);
                            setImg(urls);
                            activityData.imgUrl = urls;
                        })
                        .catch(error => reject(error));
                });

                // Resolve the promise when all upload tasks are finished
                Promise.all(uploadTasks)
                    .then(() => resolve())
                    .catch(error => reject(error));
            }
        });
    }

    const checkIfFieldsAreValid = () => {
        // Check if any of the fields are empty
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

        return true;
    }

    const handleActitvityCreation = async () => {
        try {
            if (!checkIfFieldsAreValid()) { return; }
            setIsLoading(true)
            await uploadImages()
            console.log(activityData);
            const valRef = collection(txtDB, 'Activities');
            const docID = await addDoc(valRef, {
                activityData: activityData,
                imgUrl: activityData.imgUrl,
                username: [user?.uid, "SyAJbyX2bGg9UjXEWYgvVEKkj4z2"],
            })
                .then(async (docRef) => {
                    setDocumentID(docRef.id);
                    await updateDoc(doc(valRef, docRef.id), {
                        documentID: docRef.id
                    })

                    // Update user's createdActivities array
                    const userRef = collection(txtDB, 'Users');
                    await updateDoc(doc(userRef, user?.uid), {
                        createdActivities: arrayUnion(docRef.id),
                    });

                    setIsLoading(false)
                })

            navigate("/history");
        } catch (error) {
            setMessage("Something went wrong, please try again")
            setVisible(true)
            console.error("Error uploading activity:", error);
            setIsLoading(false);
        }
    }

    return (
        <div className="pt-[env(safe-area-inset-top)]">
            <p className="px-3 pt-4 text-xl font-semibold text-left">Create New Activity</p>
            <ImagePicker file={file} setFile={setFile} />
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
                    // disablePortal
                    id="autocomplete"
                    freeSolo
                    autoSelect
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
                        {activityData.selectedLocation === null ? "Get Location" : activityData.selectedLocation.SEARCHVAL}
                    </div>
                </button>

                <div className="pt-3 pb-12 flex space-x-4 justify-end items-center">
                    <button
                        className="border-gray-700 py-2 px-3 bg-transparent dark:border-gray-400 focus:border-transparent"
                        onClick={() => navigate("/home")}
                    >
                        Cancel
                    </button>

                    <button
                        className="py-2 px-3 w-36 bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
                        onClick={handleActitvityCreation}
                    >
                        {isLoading ? (
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                            </svg>
                        ) : (
                            <p>Create Activity</p>
                        )}
                    </button>
                </div>
            </div>

            <LocationSelectorModal showModal={showModal} setShowModal={setShowModal} setActivityDataLocation={setActivityDataLocation} />
            <Alert visible={visible} setVisible={setVisible} message={message} />
        </div>
    )
};

export default NewActivityNew;