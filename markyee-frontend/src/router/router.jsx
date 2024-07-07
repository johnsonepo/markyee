import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuestLayout from "../components/layouts/GuestLayout";
import AppLayout from "../components/layouts/AppLayout";
import Login from "../pages/Login";
import AuthKeyCheck from "../pages/AuthKeyCheck";
import User from "../pages/User";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GuestLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="signin" element={<Login />} />
                    <Route path="auth/:auth_key" element={<AuthKeyCheck />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="user/:user" element={<AppLayout />}>
                    <Route index element={<User />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
