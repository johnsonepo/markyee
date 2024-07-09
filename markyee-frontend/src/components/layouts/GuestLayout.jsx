import { Outlet } from 'react-router-dom';

const GuestLayout = () => {

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default GuestLayout;
