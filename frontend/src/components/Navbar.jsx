import {useAuth} from "../context/AuthContext.jsx"
import {Link} from "react-router-dom"
import {authUrl} from "../config/config.js"
import axios from "axios"
import toast from "react-hot-toast";

function Navbar () {

    const {user, setUser} = useAuth();

    const handleLogout = () => {
        axios.post(`${authUrl}/users/logout`, {}, {
            withCredentials: true
        })
        .then(() => {
            toast.success("User logged out successfully !!");
            setUser(null);
        })
        .catch((err) => {
            console.log("Something went wrong while logging out the user : ", err);
            toast.error("Something went wrong while logging you out !!")
        })
    }

    return (
        <div
        className="bg-blue-400 border rounded-full p-4 m-4 flex justify-between sticky top-4"  
        >
            <div>
                <h1
                className="font-bold"
                >
                    Auth-Dashboard
                </h1>
            </div>

            <div
            className="flex justify-evenly w-[10rem]"
            >
                <button
                className="font-bold"
                >
                    <Link to="/">Home</Link>
                </button>

                {user 
                ? <div>
                    <button
                    className="font-bold"
                    >
                        <Link to="/user/dashboard">Dashboard</Link>
                    </button>
                </div> 
                : ""}
            </div>

            {user 
            ? <div>
                <button
                className="cursor-pointer font-bold"
                onClick={handleLogout}
                >
                    logout
                </button>
            </div> 
            : <div className="flex justify-evenly w-[10rem]">
                <button
                className="font-bold"
                >
                    <Link to="/user/signup">Signup</Link>
                </button>

                <button
                className="font-bold"
                >
                    <Link to="/user/login">Login</Link>
                </button>
            </div>}
        </div>
    )
}

export default Navbar;