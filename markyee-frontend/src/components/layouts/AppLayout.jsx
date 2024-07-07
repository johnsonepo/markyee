import { Outlet, useNavigate } from 'react-router-dom';

const GuestLayout = () => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
        navigate('/signin');
        return;
    }

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default GuestLayout;
