import { Dialog, Transition } from '@headlessui/react';
import dayjs from "dayjs";
import { arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { Fragment, useEffect, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { UserAuth } from "../../context/AuthContext";
import { txtDB } from "../../firebase";

const ActivityModal = ({ showModal, setShowModal, selectedActivity }) => {

    const navigate = useNavigate();
    const { user } = UserAuth();

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [joinedUsers, setJoinedUsers] = useState([]);

    const joinActivity = async () => {
        // Add the userID to the activity
        const activityRef = collection(txtDB, "Activities");
        const docRef = selectedActivity.documentID;

        // Add a check to see if the user is already in the list
        if (selectedActivity.activityData.joinedUsers.includes(user.uid)) {
            console.log("User is already joined in this activity.");
            return;
        }

        // Add another check to see if the activity is full
        if (selectedActivity.activityData.joinedUsers.length >= selectedActivity.activityData.numberOfGuests) {
            console.log("Activity is already full.");
            return;
        }

        // Else we add the user
        setIsLoading(true);
        await updateDoc(doc(activityRef, docRef), {
            'activityData.joinedUsers': arrayUnion(user.uid)
        })
            .then(async () => {
                // Update user's joinedActivities array
                const userRef = collection(txtDB, 'Users');
                await updateDoc(doc(userRef, user?.uid), {
                    joinedActivities: arrayUnion(docRef),
                });

                console.log("Document successfully updated!");
                setIsLoading(false);
                navigate('/history', { state: { activeTab: 1 } });
            })
    }

    useEffect(() => {
        const fetchJoinedUsers = async () => {
            try {
                const userCollectionRef = collection(txtDB, 'Users');
                const users = [];

                // Fetch the creator's username
                if (selectedActivity?.username) {
                    const creatorDocRef = doc(userCollectionRef, selectedActivity.username[0]);
                    const creatorDocSnapshot = await getDoc(creatorDocRef);
                    if (creatorDocSnapshot.exists()) {
                        users.push(creatorDocSnapshot.data().username);
                    }
                }

                // Fetch joined users' usernames
                if (selectedActivity?.activityData?.joinedUsers) {
                    for (const userId of selectedActivity.activityData.joinedUsers) {
                        const userDocRef = doc(userCollectionRef, userId);
                        const userDocSnapshot = await getDoc(userDocRef);
                        if (userDocSnapshot.exists()) {
                            users.push(userDocSnapshot.data().username);
                        }
                    }
                }

                setJoinedUsers(users);
            } catch (error) {
                console.error('Error fetching joined users:', error);
            }
        }
        fetchJoinedUsers();
    }, [selectedActivity]);

    return (
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-20 text-black dark:text-white" onClose={() => { setShowModal(false) }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 h-full overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-3 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 py-3 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    className="text-xl font-semibold px-3"
                                >
                                    <div className="flex justify-between items-center">
                                        {selectedActivity && selectedActivity.activityData.activityType}
                                        <button className="p-0 bg-transparent focus:border-transparent hover:border-transparent focus:outline-none" onClick={() => { setShowModal(false) }}>
                                            <RxCross2 />
                                        </button>
                                    </div>
                                </Dialog.Title>

                                {selectedActivity &&
                                    <div className="py-2.5">
                                        <div className='flex mt-2 mb-3 px-3 space-x-3 overflow-x-auto w-full scroll-smooth scrollbar-none'>
                                            {selectedActivity.activityData.imgUrl.length > 0 ? (
                                                selectedActivity.activityData.imgUrl.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt="Activity_Image"
                                                        className={`bg-gray-100 ${selectedActivity.activityData.imgUrl.length > 1 ? 'w-64' : 'w-full'} h-44 object-cover object-center rounded-md`}
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
                                        <div className="my-2.5 mx-3">
                                            <div className="mb-2.5">
                                                <h4 className="font-bold">Description</h4>
                                                <p>{selectedActivity.activityData.description}</p>
                                            </div>

                                            <div className="mb-2.5">
                                                <h4 className="font-bold">Duration</h4>
                                                <p>{dayjs(selectedActivity.activityData.date[0].toDate()).format('dddd, DD/MM/YYYY, HH:mm')} - {dayjs(selectedActivity.activityData.date[1].toDate()).format('dddd, DD/MM/YYYY, HH:mm')}</p>
                                            </div>

                                            {joinedUsers.length > 0 &&
                                                <div className="mb-2.5">
                                                    <h4 className="font-bold">Joined</h4>
                                                    {joinedUsers.map((username, index) => (
                                                        <div key={index} className="flex items-center">
                                                            <p>@{username}</p>
                                                            {index === 0 && <p className="bg-blue-200 ml-2 text-blue-900 text-xs px-2 rounded-sm">creator</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            }

                                            {selectedActivity.activityData.selectedLocation &&
                                                <div className="mb-2.5">
                                                    <h5 className="font-bold">Location</h5>
                                                    <iframe id="om-minimap-preview"
                                                        src={`https://www.onemap.gov.sg/amm/amm.html?marker=latLng:${selectedActivity.activityData.selectedLocation.LATITUDE},${selectedActivity.activityData.selectedLocation.LONGITUDE}!colour:red&zoomLevl=16&design=Default`}
                                                        allowFullScreen="allowFullScreen"
                                                        className="rounded-lg my-1 w-full"
                                                    >
                                                    </iframe>
                                                    <p>{selectedActivity.activityData.selectedLocation.ADDRESS}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }

                                <div className="w-full px-3">
                                    <button
                                        type="button"
                                        className="w-full h-10 items-center inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => {
                                            if (selectedActivity?.activityData?.joinedUsers?.length >= selectedActivity?.activityData?.numberOfGuests) {
                                                // Activity is full, do nothing
                                                return;
                                            } else if (selectedActivity?.activityData?.joinedUsers?.includes(user.uid)) {
                                                // User has already joined, navigate to history joined activities tab
                                                navigate('/history', { state: { activeTab: 1 } });
                                            } else if (selectedActivity?.username[0] === user.uid) {
                                                // User created this activity, navigate to history created activities tab
                                                navigate('/history', { state: { activeTab: 0 } });
                                            } else {
                                                // User can join the activity
                                                setShowConfirmationDialog(true);
                                            }
                                        }}
                                        disabled={selectedActivity?.activityData?.joinedUsers?.length >= selectedActivity?.activityData?.numberOfGuests}
                                    >
                                        {selectedActivity?.activityData?.joinedUsers?.length >=
                                            selectedActivity?.activityData?.numberOfGuests
                                            ? 'Activity is full'
                                            : selectedActivity?.username[0] === user.uid
                                                ? 'See your created activity'
                                                : selectedActivity?.activityData?.joinedUsers?.includes(user.uid)
                                                    ? 'View activity'
                                                    : 'Join activity'}
                                    </button>

                                    <ConfirmationDialog
                                        showConfirmationDialog={showConfirmationDialog}
                                        setShowConfirmationDialog={setShowConfirmationDialog}
                                        Icon={IoPeopleSharp}
                                        title={"Are you sure you want to join this activity?"}
                                        handleClick={joinActivity}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ActivityModal