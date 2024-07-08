import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import UseAxioSecure from '../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../Hook/useAxiosPublic';
import ImageUpload from '../../../components/Utility/ImageUpload';
const Testimonial_create = () => {
    const axiosSecure = UseAxioSecure();
    const [imageurl, setimageurl] = useState('');
    const axiosPublic = useAxiosPublic();
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setimageurl(res.data.data.url);
            setFormData((prevData) => ({
                ...prevData,
                image: res.data.data.url
            }));

            await Swal.fire({
                icon: 'success',
                title: 'Image uploaded successfully!',
                text: `Image URL: ${res.data.data.url}`,
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error uploading image',
                text: error.message,
            });
        }
    };


    const [formData, setFormData] = useState({
        title: '',
        name: '',
        comment: '',
        image: '',
        date: new Date(),
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCommentChange = (value) => {
        setFormData({
            ...formData,
            comment: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            date: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        // Format the date to include only month, day, and year
        const formattedDate = formData.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        try {
            const response = await axiosSecure.post("/testimonial/post",
                { ...formData, date: formattedDate },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response:", response.data);

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Testimonial added successfully",
            });

            // Optionally, reset form fields after successful submission
            setFormData({
                title: '',
                name: '',
                comment: '',
                image: '',
                date: new Date(),
            });

        } catch (error) {
            console.error("Error adding Testimonial:", error);

            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to add Testimonial",
            });
        }
    };

    return (
        <div className="poppins">
            <Helmet>
                <title>Create | Add Testimonial</title>
            </Helmet>

            {/* Top content */}
            <p className='text-2xl font-bold'>Create a testimonial</p>

            {/* breadcrumbs */}
            <div className="breadcrumbs mt-2 text-xs text-black">
                <ul>
                    <li className='text-gray-400'><a>Home</a></li>
                    <li className='text-gray-400'><a>admin</a></li>
                    <li className='text-gray-400'>testimonial</li>
                    <li className='text-gray-500'>new</li>
                </ul>
            </div>

            <div className="mt-9 ml-4">
                <p className='font-medium text-2xl'>Details</p>
                <form onSubmit={handleSubmit}>
                    <div className="mt-6">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="appearance-none text-sm border shadow-sm rounded-xl  w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Testimonial Title"
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="appearance-none text-sm border shadow-sm rounded-xl  w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Testimonial Person Name"
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={(e) => handleCommentChange(e.target.value)}
                            className="appearance-none resize-none text-sm border  shadow-sm rounded-xl h-52  w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter testimonial comment"
                            required
                        />
                    </div>
                    <div className="flex  items-center gap-5">
                        <div className='w-1/2'>
                            <div className="form-control border rounded-lg shadow-sm my-6">
                                <input onChange={handleImageUpload} type="file" className="file-input outline-none focus:outline-none" />
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                // value={imageurl}
                                onChange={handleChange}
                                className="appearance-none text-sm border shadow-sm rounded-xl w-full py-4 px-3 text-gray-700  focus:outline-none focus:shadow-outline"
                                placeholder="Enter image URL"
                            />
                        </div>
                    </div>
                    <div className="">

                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Create Testimonial
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Testimonial_create;
