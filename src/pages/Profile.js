import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";
const Profile = () => {
  const {
    user
  } = useAuth();
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name
            ?.charAt(0)
            .toUpperCase()}
        </div>
        <h1>
          {user?.name}
        </h1>
        <p className="profile-role">
          {user?.role}
        </p>
        <div className="profile-information">
          <div className="profile-row">
            <span>
              Full Name
            </span>
            <strong>
              {user?.name}
            </strong>
          </div>
          <div className="profile-row">
            <span>
              Email
            </span>
            <strong>
              {user?.email}
            </strong>
          </div>
          <div className="profile-row">
            <span>
              Account Type
            </span>
            <strong>
              {user?.role}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;