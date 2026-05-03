import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Outlet is where the Login or Register page will be injected */}
      <Outlet /> 
    </div>
  );
};

export default AuthLayout;