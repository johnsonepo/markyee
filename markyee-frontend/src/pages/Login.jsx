import { useEffect, useRef, useState } from "react";
import axiosClient from '../axios/axios-client.js';
import LoginCard from '../components/widgets/LoginCard';
import { Link , useNavigate} from "react-router-dom";
import axios from 'axios';

function Login() {
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (token) {
            const fetchUsername = async () => {
                try {
                    const response = await axios.get(`https://markyee-server.envoos.com/markyee-backend/api/user/usernamebytoken/${token}`);
                    const username = response.data.username;
                    
                    if (username) {
                        navigate(`/user/${username}`);
                    } else {
                        navigate('/signin');
                    }
                } catch (error) {
                    console.error('Error fetching username:', error);
                    navigate('/signin');
                }
            };

            fetchUsername();
        } else {
            navigate('/signin');
        }
    }, [token, navigate]);

    const loginRequest = (e) => {
        e.preventDefault();
        const payload = {
            username: userNameRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient.post('https://markyee-server.envoos.com/markyee-backend/api/signin', payload)
            .then(({ data }) => {
                console.log(data);
                localStorage.setItem('access_token', data.access_token); 
                navigate('/user/' + data.username);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between relative">
            <p className="sm:hidden text-gray-500 text-sm mt-2 absolute top-1 left-1/2 transform -translate-x-1/2">English (US)</p>
            <div className="h-4/5 flex flex-col justify-center items-center md:flex-row md:justify-center pt-[7.0rem] md:space-x-2 lg:space-x-32 xl:space-x-42 2xl:space-x-60 md:pt-[4.5rem]">
                <div className="sm:flex flex-col">
                    <h1 className="hidden sm:block text-4xl text-gray-800 mt-1">Recent Logins</h1>
                    <p className="hidden sm:block text-sm text-gray-500 mt-2">Click your picture or add an account.</p>
                    <div className="hidden md:flex mt-4">
                        <LoginCard name="Add Account" className="text-primary" />
                    </div>
                </div>
                <div>
                    <div className="w-screen sm:w-[25rem] px-4 pt-[8.2rem] sm:flex-col sm:bg-white sm:p-4 sm:mt-[3.0rem] sm:justify-center sm:shadow-xl rounded-lg">
                        <form onSubmit={loginRequest} className="space-y-3">
                            {errors && (
                                <div>
                                    {Object.keys(errors).map((key) => (
                                        <p key={key} className="text-red-500">{errors[key][0]}</p>
                                    ))}
                                </div>
                            )}
                            <input ref={userNameRef} type="text" className="bg-white h-[3.8rem] w-full shadow-sm px-3" placeholder="username or email" />
                            <input ref={passwordRef} type="password" className="bg-white h-[3.8rem] w-full shadow-sm px-3" autoComplete="current-password" placeholder="Password" />
                            <button type="submit" className="bg-primary w-full h-[2.7rem] text-white mt-8 sm:rounded-lg">Log in</button>
                            <a href="" className="text-gray-600 flex justify-center pt-2 text-sm sm:text-primary">Forgot Password?</a>
                            <hr className="hidden sm:block"></hr>
                            <div className="flex justify-center items-center">
                                <button className="bg-[#42B72A] w-1/2 h-[2.9rem] text-white my-3 sm:rounded-lg py-3">Sign in</button>
                            </div>
                        </form>
                    </div>
                    <p className="mt-6 text-gray-500 text-sm text-center hidden sm:block">
                        <span className="font-semibold text-gray-800 inline-flex pr-2">Don't have an account?</span>
                        <Link to="/signup" className="underline hover:cursor-pointer">Create account.</Link>
                    </p>                
                </div>
            </div>

            
            <div className="w-full h-32 sm:h-36 sm:bg-white px-4 pt-1">
                <button className="hidden bg-transparent text-ns text-gray-600 w-full h-[2.3rem] border border-gray-300">Create new account</button>
                <div className=" mt-3 text-gray-600 text-xs">
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

export default Login;
