import React, { Fragment } from "react";
import { Transition, Dialog } from '@headlessui/react';
import { IoClose } from "react-icons/io5";

const ConfirmationDialog = ({ showConfirmationDialog, setShowConfirmationDialog, Icon, title, handleClick, isLoading, type = "Default" }) => {

    // Type can be "Default" or "Destruct"
    // "Default" type the button will be blue
    // "Destruct" type the button will be red

    return (
        <Transition appear show={showConfirmationDialog} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => { setShowConfirmationDialog(false) }}>
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

                <div className="fixed inset-0 overflow-y-auto">
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
                            <div className="relative p-4 text-center bg-white rounded-xl shadow dark:bg-gray-800">
                                <button
                                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                                    onClick={() => { setShowConfirmationDialog(false) }}
                                >
                                    <IoClose className="w-5 h-5" />
                                </button>
                                <Icon className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" />
                                <p className="mb-4 text-gray-500 dark:text-gray-300">{title}</p>
                                <div className="flex justify-center items-center space-x-4">
                                    <button
                                        className="text-sm h-9 w-28 font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                        onClick={() => { setShowConfirmationDialog(false) }}
                                    >
                                        No, cancel
                                    </button>
                                    <button
                                        className={`text-sm h-9 w-28 font-medium text-center flex justify-center text-white ${type === "Default" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900" }`} 
                                        onClick={handleClick}
                                    >
                                        {isLoading ? (
                                            <svg aria-hidden="true" role="status" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                            </svg>
                                        ) : (
                                            <p>Yes, I'm sure</p>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ConfirmationDialog