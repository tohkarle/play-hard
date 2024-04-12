import React, { useState } from 'react'
import { IoAdd, IoPin } from "react-icons/io5";

const ImagePicker = ({ file, setFile }) => {

    const [images, setImages] = useState([]);

    const uploadSingleFile = (e) => {
        // Create an array of images URLs
        const files = Array.from(e.target.files);
        const images = files.map((file) => URL.createObjectURL(file));
        setFile(files);
        setImages(images);
    }

    // Delete image
    function deleteFile(e) {
        const newFile = file.filter((item, index) => index !== e);
        const newImages = images.filter((item, index) => index !== e);
        setFile(newFile);
        setImages(newImages);
    }

    return (
        <div className="flex space-x-3 overflow-x-auto mt-4 mb-5">
            {images.map((item, index) => (
                <div key={index} className={`ml-3`}>
                    <img
                        src={item}
                        alt=""
                        className={`object-cover w-28 h-28 rounded-xl`}
                    />
                    <button
                        className="w-28 bg-transparent hover:border-transparent focus:border-transparent pb-0"
                        onClick={() => deleteFile(index)}
                    >Delete</button>
                </div>
            ))}
            <label htmlFor="dropzone-file" className="mx-3 flex items-center justify-center w-28 h-28 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center w-28 h-28">
                    <IoAdd className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    accept="image/*"
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    disabled={file.length === 5}
                    onChange={uploadSingleFile}
                    multiple
                />
            </label>
        </div>
    )
}

export default ImagePicker