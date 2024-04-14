import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/play.png';
import Alert from "../../components/Alert";
import { UserAuth } from "../../context/AuthContext";
import useEmailValidator from "../../hooks/useEmailValidator";
import usePasswordValidator from "../../hooks/usePasswordValidator";

/**
 * SignUpNew component represents the sign-up page with fields for username, email, password, and password confirmation.
 * 
 * @returns {JSX.Element} SignUpNew component
 */
const SignUpNew = () => {

    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const { email, isValidEmail, handleEmailChange } = useEmailValidator();
    const { password, isValidPassword, handlePasswordChange } = usePasswordValidator();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    const { createUser } = UserAuth();

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!isValidEmail) {
            setMessage("Please enter a valid email address")
            setVisible(true)
            return;
        }

        if (!isValidPassword) {
            setMessage("Password must be minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number")
            setVisible(true)
            return;
        }

        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            setMessage("Please fill up all fields")
            setVisible(true)
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Password do not match")
            setVisible(true)
            return;
        }

        setIsLoading(true)
        try {
            await createUser(email, password, username)
            setIsLoading(false)
            setMessage("")
            setVisible(false)
            navigate("/home")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
            setIsLoading(false)
            setMessage(errorCode, errorMessage)
            setVisible(true)
        }
    }

    return (
        <div className="px-6 flex justify-center items-center h-screen text-black dark:text-white">
            <div className="w-full max-w-sm px-2 bg-white border border-gray-200 rounded-3xl shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-9 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-28 w-auto"
                            src={logo}
                            alt="logo"
                        />
                    </div>

                    <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => handleEmailChange(e)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="example@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium ">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => handlePasswordChange(e)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="repeat-password" className="block text-sm font-medium ">
                                    Repeat Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="repeat-password"
                                        name="repeat-password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                {isLoading ? (
                                    <button disabled type="button" className="w-full justify-center py-2 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                        </svg>
                                        Loading...
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={onSubmit}
                                    >
                                        Sign up
                                    </button>
                                )}
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already a member?{' '}
                            <a
                                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                                onClick={() => { navigate("/") }}
                            >
                                Log in
                            </a>
                        </p>
                    </div>
                </div>
                <Alert visible={visible} setVisible={setVisible} message={message} />
            </div>
        </div>
    )
};

export default SignUpNew;