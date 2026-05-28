import { Outlet } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";
import UserFooter from "../components/user/UserFooter";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <UserNavbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <UserFooter />
    </div>
  );
};

export default UserLayout;
