import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

 function AuthKeyCheck() {
    const authKeyRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState(null);
    const [authToken, setAuthToken] = useState("");
    const [loadingRequest, setLoadingRequest] = useState(false);

    //const baseurl = 'https://markyee-server.envoos.com/markyee-backend';
    const baseurl = 'http://localhost:9900';

    useEffect(() => {
        const pathParts = location.pathname.split("/");
        const auth_key = pathParts[pathParts.length - 1];
        setAuthToken(auth_key);

    }, [location.pathname]);

    const activateUserRequest = async (e) => {
        e.preventDefault();
        const inputValue = authKeyRef.current.value.trim();

        try {
            setLoadingRequest(true);            
            if (authToken !== inputValue) {
                setErrors({ error: 'Invalid Auth Key' });
            } else {
                const response = await axios.post(`${baseurl}/api/user/detail/${authToken}`);
                if (response.data.is_verified === 1) {
                    navigate('/signin');
                } else {
                    setErrors({ error: 'Error activating user' });
                }
            }
        } catch (error) {
            console.error('Error verifying Auth Key:', error);
            setErrors({ error: 'Error verifying Auth Key' });
        } 
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between relative">
            <p className="sm:hidden text-gray-500 text-sm mt-2 absolute top-1 left-1/2 transform -translate-x-1/2">English (US)</p>
            <div className="h-4/5 flex flex-col justify-center items-center md:flex-row md:justify-center pt-[7.0rem] md:space-x-2 lg:space-x-32 xl:space-x-42 2xl:space-x-60 md:pt-[4.5rem]">
                <div className="w-screen sm:w-[25rem] px-4 pt-[8.2rem] sm:flex-col sm:bg-white sm:p-4 sm:mt-[3.0rem] sm:justify-center sm:shadow-xl rounded-lg">
                    <p className="text-gray-800 text-xl mt-4">Auth Code: {authToken}</p>
                    {errors && (
                        <div>
                            <p className="text-red-500">{errors.error}</p>
                        </div>
                    )}
                    <form onSubmit={activateUserRequest} className="space-y-3">
                        <input 
                            ref={authKeyRef} 
                            type="text" 
                            className="bg-white h-[3.8rem] w-full shadow-sm px-3" 
                            placeholder="Enter code" 
                        />
                        <div className="hidden sm:flex sm:justify-center sm:items-center">
                            <button type="submit" disabled={loadingRequest} className={`bg-[#42B72A] w-1/2 h-[2.9rem] text-white my-3 sm:rounded-lg py-3 ${loadingRequest ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loadingRequest ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                        <hr className="hidden sm:block" />
                    </form>
                    <p className="mt-6 text-gray-500 text-sm text-center hidden sm:block">
                        <span className="font-semibold text-gray-800 inline-flex pr-2">Have an account?</span>
                        <Link to="/signin" className="underline hover:cursor-pointer">Sign in.</Link>
                    </p>
                </div>
            </div>
    
            <div className="w-full h-32 sm:h-36 sm:bg-white px-4 pt-1">
                <button className="hidden bg-transparent text-xs text-gray-600 w-full h-[2.3rem] border border-gray-300">Create new account</button>
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
export default AuthKeyCheck;