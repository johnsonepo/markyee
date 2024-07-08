import { FaCirclePlus } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
export default function LoginCard({ name, src, children, className}) {

    return (
            <div className={`relative w-[10rem] h-[13rem] bg-slate-400 rounded-lg flex flex-col justify-between overflow-hidden my-2 mr-4  border border-gray-200`}>
                {
                    src?
                    <div className="h-3/4 relative">
                        <img src={src} className="w-full object-cover bg-[#F5F6F7]"/>
                        <div className="bg-gray-500 w-4 h-4 rounded-full absolute flex justify-center items-center top-0 left-0">
                            <IoCloseOutline  size="12px" color="white"/>
                        </div>
                        <div className="bg-red-500 text-white w-6 h-6 rounded-full absolute flex justify-center items-center top-1 right-1 overflow-visible z-10" >
                            5
                        </div>
                    </div>
                    :
                    <div className="h-3/4 object-cover bg-[#F5F6F7]"/>
                }
                <div className={`h-1/4 bg-white text-center content-center text-gray-600 ${className}`}>
                    {name}
                </div>
                {!src &&
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaCirclePlus size="40px" color="blue"/>
                </div>
                }
            </div>
    )
}

