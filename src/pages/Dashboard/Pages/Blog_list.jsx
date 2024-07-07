import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import useAxiosPublic from '../../../Hook/useAxiosPublic';
import Swal from 'sweetalert2';

const Blog_list = () => {
    const axiosSecure = useAxiosPublic();
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [count, setCount] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get('/news/get-all');
                setUsersData(res.data);
                setCount(res.data.length);
                setIsLoading(false);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [axiosSecure]);

    const updateUserData = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return usersData.slice(startIndex, endIndex);
    };

    const handleEdit = (post) => {
        console.log('Editing post:', post);
        // Add your edit logic here
    };

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/news/delete/${postId}`);
                const res = await axiosSecure.get('/news/get-all');
                setUsersData(res.data);
                setCount(res.data.length);

                // Show success notification
                Swal.fire(
                    'Deleted!',
                    'Your blog post has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting blog post:', error);

                // Show error notification
                Swal.fire(
                    'Error!',
                    'There was an error deleting the blog post.',
                    'error'
                );
            }
        }
    };

    const handleView = (post) => {
        console.log('Viewing post:', post);
    };

    const numberOfPages = Math.ceil(count / itemsPerPage);

    return (
        <div className=''>
            <Helmet>
                <title>Admin | Blog / News Lists</title>
            </Helmet>
            <div className="poppins">
                <div className="">

                    {/* Top content */}
                    <p className='text-2xl font-bold'>List</p>

                    {/* breadcrumbs */}
                    <div className="breadcrumbs mt-2 text-xs text-black">
                        <ul>
                            <li className='text-gray-400'><a>Home</a></li>
                            <li className='text-gray-400'><a>admin</a></li>
                            <li className='text-gray-400'>blog</li>
                            <li className='text-gray-500'>list</li>
                        </ul>
                    </div>

                    {/* Main section */}
                    {/* <div className="flex justify-between items-center">
                        <h2 className="text-4xl font-bold ">Total Posts: {usersData.length}</h2>
                    </div> */}

                    <section className='p-5 mt-6 border rounded-2xl border-gray-100 shadow'>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className=''>
                                    <tr className="text-xs text-gray-500 text-left">
                                        <th className="p-3 rounded-full">Key</th>
                                        <th className="p-3 rounded-full">Title</th>
                                        <th className="p-3 rounded-full">Date</th>
                                        <th className="p-3 rounded-full">Category</th>
                                        <th className="p-3 rounded-full">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {updateUserData().map((post, index) => (
                                        <tr key={post._id} >
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2">{post.title}</td>
                                            <td className="px-4 py-2">{post.date}</td>
                                            <td className="px-4 py-2">{post.category}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 flex items-center justify-center"
                                                >
                                                    Delete
                                                    <FaTrashAlt className="ml-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleView(post)}
                                                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* pagination */}
                    {/* {count >= itemsPerPage && (
                        <div className="pagination flex items-center justify-center mt-6 space-x-4">
                            <p className="text-white">Current Page: {currentPage + 1}</p>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                disabled={currentPage === 0}
                            >
                                Prev
                            </button>
                            {[...Array(numberOfPages)].map((_, index) => (
                                <button
                                    onClick={() => setCurrentPage(index)}
                                    key={index}
                                    className={`px-4 py-2 rounded ${currentPage === index ? 'bg-yellow-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-4 py-2 rounded ${currentPage === numberOfPages - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                disabled={currentPage === numberOfPages - 1}
                            >
                                Next
                            </button>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(0);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                            </select>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Blog_list;