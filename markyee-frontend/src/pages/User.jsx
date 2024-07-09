import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from '../app/features/userReducer/userSlice';
import { removeUser } from '../app/features/userReducer/userSlice';
import { FaSignOutAlt } from 'react-icons/fa';

function User() {
    const location = useLocation();
    const [errors, setErrors] = useState(null);
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);
    const passwordRef = useRef(null);

    const baseurl = 'https://markyee-server.envoos.com/markyee-backend';
    //const baseurl = 'http://localhost:9900';

    useEffect(() => {
        const pathParts = location.pathname.split("/");
        const username = pathParts[pathParts.length - 1];

        const storedUserData = JSON.parse(localStorage.getItem("user_" + username));
        setCurrentUser(storedUserData);
        if (!storedUserData || storedUserData.username !== username) {
            navigate('/signin');
            return;
        }

        userNameRef.current.value = storedUserData.username;
        emailRef.current.value = storedUserData.email;
        mobileRef.current.value = storedUserData.mobile;
        passwordRef.current.value = storedUserData.password ?? '';

    }, [location.pathname, navigate]);

    const updateRequest = async (e) => {
        e.preventDefault();

        const payload = {
            username: userNameRef.current.value,
            email: emailRef.current.value,
            mobile: mobileRef.current.value,
            password: passwordRef.current.value,
        };
       
        axios.patch(`${baseurl}/api/user/update/${currentUser.id}`, payload)
        .then(({ data }) => {
            dispatch(updateUser(data));
            setCurrentUser(data);
        })
        .catch(error => {
            console.error(error.response.data);
            if (error.response && error.response.data) {
                const err = error.response.data.error;
                setErrors(err);
                console.error('Update error:', err);
            } else {
                console.error('Update error:', error);
                setErrors('An unknown error occurred.');
            }
        });

    };
    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete your account?')) {
            axios.delete(`${baseurl}/api/user/delete/${currentUser.id}`)
            .then(({data}) => {
                dispatch(removeUser(data.username));
                localStorage.removeItem(`user_${data.username}`);
                setCurrentUser({});
                navigate('/signin'); 
            })
            .catch(error => {
                console.error('Delete error:', error);
                setErrors('An error occurred while deleting your account.');
            });
        }
    };
    const handleLogout = (e) => {
        e.preventDefault();
        currentUser.username;
        dispatch(removeUser(currentUser.username));
        localStorage.removeItem(`user_${currentUser.username}`);
        console.log('Logging out...', currentUser.username);
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between relative">
            <p className="sm:hidden text-gray-500 text-sm mt-2 absolute top-1 left-1/2 transform -translate-x-1/2">English (US)</p>
            <div className="h-4/5 flex flex-col justify-center items-center md:flex-row md:justify-center pt-[7.0rem] md:space-x-2 lg:space-x-32 xl:space-x-42 2xl:space-x-60 md:pt-[4.5rem]">
                <div>
                    <div className="w-screen sm:w-[25rem] px-4 pt-[8.2rem] sm:flex-col sm:bg-white sm:p-4 sm:mt-[3.0rem] sm:justify-center sm:shadow-xl rounded-lg">
                        {errors && (
                            <div>
                                <p className="text-red-500">{errors}</p>
                            </div>
                        )}
                        <form className="relative space-y-3">
                        <div className="absolute top-3 right-3 flex items-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                            <input ref={userNameRef} type="text" className="bg-white h-[3.8rem] w-full shadow-sm px-3" placeholder="Username" />
                            <input ref={emailRef} type="email" className="bg-white h-[3.8rem] w-full shadow-sm px-3" placeholder="Email" />
                            <input ref={mobileRef} type="text" className="bg-white h-[3.8rem] w-full shadow-sm px-3" placeholder="Mobile" />
                            <input ref={passwordRef} type="text" className="bg-white h-[3.8rem] w-full shadow-sm px-3" placeholder="Password" />
                            <hr className="hidden sm:block"></hr>
                            <div className="flex justify-center items-center space-x-2 ">
                                <button onClick={updateRequest} className="bg-[#42B72A] w-1/2 h-[2.9rem] text-white my-3 sm:rounded-lg py-3">Update</button>
                                <button onClick={handleDelete} className="bg-[#ce4641] w-1/2 h-[2.9rem] text-white my-3 sm:rounded-lg py-3">Delete</button>
                            </div>
                        </form>
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
