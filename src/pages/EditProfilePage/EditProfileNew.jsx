import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import { UserAuth } from "../../context/AuthContext";
import { imgDB, txtDB } from "../../firebase";

const EditProfileNew = () => {

    const navigate = useNavigate();
    const { user } = UserAuth();

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState(user?.username || "");
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [telegramUsername, setTelegramUsername] = useState(user?.telegramUsername || "");
    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
    const [bio, setBio] = useState(user?.bio || "");

    let userData = {
        uid: user?.uid,
        username: username,
        profileImageUrl: file && image ? imageUrl : user?.profileImageUrl ? user?.profileImageUrl : "",
        mobileNumber: mobileNumber,
        telegramUsername: telegramUsername,
        bio: bio,
        createdActivities: user?.createdActivities,
        joinedActivities: user?.joinedActivities
    };

    const convertToImage = (e) => {
        const image = URL.createObjectURL(e.target.files[0]);
        setFile(e.target.files[0]);
        setImage(image);
    }

    // Delete image
    function deleteFile() {
        setFile(null);
        setImage(null);
    }

    const uploadImage = async () => {
        return new Promise((resolve, reject) => {
            if (!file || !image) {
                // No file selected, resolve immediately
                resolve();
                return;
            }

            const imgRef = ref(imgDB, `profilePictures/${user?.uid}`);
            uploadBytes(imgRef, file)
                .then(data => getDownloadURL(data.ref))
                .then(url => {
                    console.log("url: ", url);
                    setImageUrl(url);
                    userData.profileImageUrl = url
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const checkIfFieldsAreValid = () => {
        // Check if any of the fields are empty
        if (username === "" || userData.username === "") {
            setMessage("Username cannot be empty");
            setVisible(true);
            return false;
        }

        if (email === "" || userData.email === "") {
            setMessage("Email cannot be empty");
            setVisible(true);
            return false;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setVisible(true);
            return false;
        }

        return true;
    }

    const reAuth = async (auth) => {
        let credential;
        try {
            credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            );
        } catch (error) {
            console.log(error.message);
        }
        try {
            reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                console.log("Reauthenticated successfully");
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSaveProfile = async () => {
        try {
            if (!checkIfFieldsAreValid()) { return; }
            setIsLoading(true);
            await uploadImage();
            let updatingEmail = email !== user?.email && email !== "";
            let updatingPassword = password && confirmPassword && password === confirmPassword;
            if (updatingEmail || updatingPassword) {
                const auth = getAuth();
                await reAuth(auth);

                // Update email in Firebase Authentication
                if (updatingEmail) {
                    try {
                        await updateEmail(auth.currentUser, email)
                        console.log("Email updated successfully");

                        // Update the email field in the Users collection
                        const userRef = doc(txtDB, 'Users', user.uid);
                        updateDoc(userRef, { email: email });
                    } catch (error) {
                        console.log("Failed to update email: ", error.message);
                        setIsLoading(false)
                        setMessage(error.code, error.message);
                        setVisible(true);
                        return;
                    }
                }

                // Update password in Firebase Authentication
                if (updatingPassword) {
                    try {
                        await updatePassword(auth.currentUser, password)
                        console.log("Password updated successfully");
                    } catch (error) {
                        console.log("Failed to update password: ", error.message);
                        setIsLoading(false)
                        setMessage(error.code, error.message);
                        setVisible(true);
                        return;
                    }
                }
            }
            const userRef = collection(txtDB, 'Users');
            await setDoc(doc(userRef, user?.uid), userData, { merge: true })
            setIsLoading(false);
            navigate("/profile");
        } catch (error) {
            setMessage(error);
            setVisible(true);
            console.error("Error updating user:", error);
            setIsLoading(false);
        }
    }
    
    return (
        <div className="pt-[env(safe-area-inset-top)] text-black dark:text-white">
            <p className="px-4 pt-4 text-xl font-semibold text-left">Edit Profile</p>
            <div className="w-full mt-6 flex justify-center">
                {file && image ? (
                    <div>
                        <label htmlFor="dropzone-file" className="mx-3 flex items-center justify-center w-28 h-28 rounded-full cursor-pointer bg-gray-50">
                            <img
                                src={image}
                                className="flex items-center justify-center w-28 h-28 rounded-full cursor-pointer object-cover"
                            />
                            <input
                                accept="image/*"
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={convertToImage}
                            />
                        </label>

                        <button
                            className="w-full text-sm bg-transparent hover:border-transparent focus:border-transparent pb-0 text-red-500"
                            onClick={deleteFile}
                        >Discard image</button>
                    </div>
                ) : (
                    <>
                        {user?.profileImageUrl ? (
                            <label htmlFor="dropzone-file" className="mx-3 flex items-center justify-center w-28 h-28 rounded-full cursor-pointer bg-gray-50">
                                <img
                                    src={user?.profileImageUrl}
                                    className="object-cover flex items-center justify-center w-28 h-28 rounded-full cursor-pointer"
                                />
                                <input
                                    accept="image/*"
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={convertToImage}
                                />
                            </label>
                        ) : (
                            <>
                                <label htmlFor="dropzone-file" className="mx-3 flex items-center justify-center w-28 h-28 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <IoAdd className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                                    <input
                                        accept="image/*"
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={convertToImage}
                                    />
                                </label>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="px-6 pt-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Email address
                </p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Change password
                </p>
                <input
                    type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder=" New password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <input
                    type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Username
                </p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Full name
                </p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Telegram username
                </p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="username"
                    value={telegramUsername}
                    onChange={(e) => { setTelegramUsername(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Mobile number
                </p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="+65 8123 4567"
                    value={mobileNumber}
                    onChange={(e) => { setMobileNumber(e.target.value) }}
                />
            </div>

            <div className="px-6 pb-6 space-y-2">
                <p className="ml-1 text-sm font-semibold text-left">
                    Bio
                </p>
                <textarea
                    rows="5"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                    placeholder="Write your bio here"
                    value={bio}
                    onChange={(e) => { setBio(e.target.value) }}
                ></textarea>
            </div>

            <div className="pt-4 pb-12 px-3 flex space-x-4 justify-end items-center">
                <button
                    className="border-gray-700 py-2 px-3 bg-transparent dark:border-gray-400 focus:border-transparent"
                    onClick={() => navigate("/profile")}
                >
                    Cancel
                </button>

                <button
                    className="py-2 px-3 w-32 bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
                    onClick={handleSaveProfile}
                >
                    {isLoading ? (
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                        </svg>
                    ) : (
                        <p>Save profile</p>
                    )}
                </button>
            </div>
            <Alert visible={visible} setVisible={setVisible} message={message} />
        </div>
    );
};

export default EditProfileNew;