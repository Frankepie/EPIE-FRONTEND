import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  FaBell
} from "react-icons/fa";

import {
  useAuth
} from "../context/AuthContext";

import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../services/api";

import "../styles/AdminNotificationBell.css";


const AdminNotificationBell = () => {

  const {
    token
  } = useAuth();


  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  const dropdownRef =
    useRef(null);


  // ========================================
  // LOAD NOTIFICATIONS
  // ========================================

  const loadNotifications =
    async () => {

      if (!token) return;


      try {

        setLoading(true);


        const data =
          await getAdminNotifications(
            token
          );


        setNotifications(
          data.notifications || []
        );


        setUnreadCount(
          data.unreadCount || 0
        );


      } catch (error) {

        console.error(
          "Notification error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadNotifications();

  }, [token]);


  // ========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ========================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ========================================
  // OPEN DROPDOWN
  // ========================================

  const handleOpen =
    () => {

      setOpen(
        previous =>
          !previous
      );

    };


  // ========================================
  // MARK ONE AS READ
  // ========================================

  const handleNotificationClick =
    async (notification) => {

      try {

        if (!notification.read) {

          await markNotificationAsRead(

            token,

            notification._id

          );


          setNotifications(
            previous =>
              previous.map(item =>

                item._id ===
                notification._id

                  ? {
                      ...item,
                      read: true
                    }

                  : item

              )
          );


          setUnreadCount(
            previous =>
              Math.max(
                previous - 1,
                0
              )
          );

        }

      } catch (error) {

        console.error(
          error
        );

      }

    };


  // ========================================
  // MARK ALL AS READ
  // ========================================

  const handleMarkAllRead =
    async () => {

      try {

        await markAllNotificationsAsRead(
          token
        );


        setNotifications(
          previous =>
            previous.map(
              notification => ({
                ...notification,
                read: true
              })
            )
        );


        setUnreadCount(0);


      } catch (error) {

        console.error(
          error
        );

      }

    };


  return (

    <div
      className="admin-notification-wrapper"
      ref={dropdownRef}
    >


      {/* BELL */}

      <button
        type="button"
        className="admin-notification-button"
        onClick={handleOpen}
        aria-label="Notifications"
      >

        <FaBell />


        {unreadCount > 0 && (

          <span className="admin-notification-count">

            {unreadCount > 99
              ? "99+"
              : unreadCount}

          </span>

        )}

      </button>


      {/* DROPDOWN */}

      {open && (

        <div className="admin-notification-dropdown">


          <div className="admin-notification-header">

            <div>

              <strong>
                Notifications
              </strong>

              {unreadCount > 0 && (

                <span>
                  {unreadCount} unread
                </span>

              )}

            </div>


            {unreadCount > 0 && (

              <button
                type="button"
                onClick={
                  handleMarkAllRead
                }
              >
                Mark all read
              </button>

            )}

          </div>


          <div className="admin-notification-list">


            {loading ? (

              <div className="admin-notification-empty">

                Loading notifications...

              </div>

            ) : notifications.length === 0 ? (

              <div className="admin-notification-empty">

                <FaBell />

                <p>
                  No notifications yet.
                </p>

              </div>

            ) : (

              notifications.map(
                notification => (

                  <button
                    type="button"
                    key={
                      notification._id
                    }
                    className={
                      notification.read
                        ? "admin-notification-item"
                        : "admin-notification-item unread"
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    <div className="admin-notification-item-icon">

                      <FaBell />

                    </div>


                    <div className="admin-notification-item-content">

                      <strong>
                        {notification.title}
                      </strong>

                      <p>
                        {notification.message}
                      </p>

                      <small>
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </small>

                    </div>

                  </button>

                )
              )

            )}

          </div>

        </div>

      )}

    </div>

  );

};


export default AdminNotificationBell;