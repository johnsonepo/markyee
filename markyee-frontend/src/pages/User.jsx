import { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function User() {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const pathParts = location.pathname.split("/");
        const username = pathParts[pathParts.length - 1]; 

        const fetchUserData = async () => {
            try {
                const access_token = localStorage.getItem("access_token");

                if (!access_token) {
                    navigate('/signin');
                }
                const response = await axios.get(`https://markyee-server.envoos.com/markyee-backend/api/user/username/${username}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                //navigate('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [location.pathname]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between relative">
            <p className="sm:hidden text-gray-500 text-sm mt-2 absolute top-1 left-1/2 transform -translate-x-1/2">English (US)</p>
            <div className="h-4/5 flex flex-col justify-center items-center md:flex-row md:justify-center pt-[7.0rem] md:space-x-2 lg:space-x-32 xl:space-x-42 2xl:space-x-60 md:pt-[4.5rem]">
                <div>
                    <div className="w-screen sm:w-[25rem] px-4 pt-[8.2rem] sm:flex-col sm:bg-white sm:p-4 sm:mt-[3.0rem] sm:justify-center sm:shadow-xl rounded-lg">
                        {userData ? (
                            <div>
                                <p className="text-gray-800 text-xl mt-4">User Data:</p>
                                <p>Username: {userData.username}</p>
                                <p>Email: {userData.email}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">User not found</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full h-32 sm:h-36 sm:bg-white px-4 pt-1">
                <button className="hidden bg-transparent text-ns text-gray-600 w-full h-[2.3rem] border border-gray-300">Create new account</button>
                <div className="mt-3 text-gray-600 text-xs">
                    <div className="flex items-center justify-center w-full h-full">
                        <img className="w-14 pt-2" src="/img/meta.png" alt="Logo" />
                    </div>
                    <ul className="flex justify-center space-x-2 mt-6">
                        <li className="hover:underline">About</li>
                        <li className="hover:underline">Help</li>
                        <li className="hover:underline">More</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default User;
