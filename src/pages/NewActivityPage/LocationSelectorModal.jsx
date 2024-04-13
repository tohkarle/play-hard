//https://www.onemap.gov.sg/apidocs/apidocs

import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from '@headlessui/react';
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

const LocationSelectorModal = ({ showModal, setShowModal, setActivityDataLocation }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [backgroundMap, setBackgroundMap] = useState("https://www.onemap.gov.sg/amm/amm.html")

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${searchQuery}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
                const data = await response.json();
                const modifiedResults = data.results.slice(0, 30).map(result => {

                    return {
                        ...result,
                        SEARCHVAL: result.BLK_NO + ", " + result.SEARCHVAL

                    };
                });
                return modifiedResults;
            } catch (error) {
                console.error("Error fetching search results:", error);
                return [];
            }
        };

        if (searchQuery.trim() !== "") {
            const fetchData = async () => {
                const results = await fetchSearchResults();
                setSearchResults(results);
            };
            fetchData();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleLocationSelect = (location) => {
        setSearchResults([]);
        const { LATITUDE, LONGITUDE } = location;
        setSelectedLocation(location);
        setSearchQuery(location.SEARCHVAL)
        setBackgroundMap(`https://www.onemap.gov.sg/amm/amm.html?marker=latLng:${LATITUDE},${LONGITUDE}!colour:red&zoomLevl=17&design=Default`);
    }

    const confirmLocationSelect = () => {
        setActivityDataLocation(selectedLocation)
        setShowModal(false)
    }

    const clearSearchText = () => {
        setSearchQuery("");
        setSearchResults([]);
    }

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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 py-3 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    className="text-xl font-semibold pl-4 pr-3"
                                >
                                    <div className="flex justify-between items-center">
                                        Search Location
                                        <button className="p-0 bg-transparent focus:border-transparent hover:border-transparent focus:outline-none" 
                                        onClick={() => { setShowModal(false) }}>
                                            <RxCross2 />
                                        </button>
                                    </div>
                                </Dialog.Title>
                                <div className="p-3 w-full space-y-4">
                                    <div className="mb-3 relative w-full">
                                        <input
                                            type="text"
                                            id="search-navbar"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                                            placeholder="Search activities..."
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value) }}
                                        />

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IoSearchOutline className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>

                                        {searchQuery != "" &&
                                            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                                                <button
                                                    className="bg-transparent p-0"
                                                    onClick={() => clearSearchText()}>
                                                    <IoCloseOutline className="text-gray-500 w-4 h-4" />
                                                </button>
                                            </div>
                                        }

                                        {searchResults.length > 0 &&
                                            <div className="absolute z-10 py-2 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                                                {searchResults.map((result, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="w-full text-sm text-left px-4 py-2 hover:bg-gray-100 bg-transparent"
                                                        onClick={() => handleLocationSelect(result)}
                                                    >
                                                        {result.SEARCHVAL}
                                                    </button>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                    <iframe
                                        id="om-minimap-preview"
                                        src={backgroundMap}
                                        allowFullScreen="allowFullScreen"
                                        className="w-full h-80 rounded-md"
                                    ></iframe>
                                </div>

                                <div className="flex justify-end px-3 mt-1">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => { confirmLocationSelect() }}
                                    >
                                        Confirm Location
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LocationSelectorModal;
