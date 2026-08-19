import { useState } from "react";

import "../styles/Notifications.css";


const Notifications = () => {

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        icon: "📝",
        title: "New Assignment",
        message:
          "A new assignment has been added to one of your courses.",
        time: "Recently",
        unread: true
      },
      {
        id: 2,
        icon: "📚",
        title: "Course Update",
        message:
          "Your course content has been updated.",
        time: "Recently",
        unread: true
      },
      {
        id: 3,
        icon: "🏆",
        title: "Learning Achievement",
        message:
          "Keep learning to earn your next certificate.",
        time: "Recently",
        unread: false
      }
    ]);


  const markAsRead = (id) => {

    setNotifications(
      notifications.map(
        notification =>
          notification.id === id
            ? {
                ...notification,
                unread: false
              }
            : notification
      )
    );

  };


  const markAllAsRead = () => {

    setNotifications(
      notifications.map(
        notification => ({
          ...notification,
          unread: false
        })
      )
    );

  };


  const unreadCount =
    notifications.filter(
      notification =>
        notification.unread
    ).length;


  return (

    <div className="notifications-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="notifications-header">

        <div>

          <p>
            Student Area
          </p>

          <h1>
            Notifications
          </h1>

          <span>
            Stay updated with your learning activities.
          </span>

        </div>


        {unreadCount > 0 && (

          <button
            type="button"
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>

        )}

      </div>


      {/* ======================================
          NOTIFICATION SUMMARY
      ====================================== */}

      <div className="notification-summary">

        <div>

          <strong>
            {unreadCount}
          </strong>

          <span>
            Unread notifications
          </span>

        </div>

      </div>


      {/* ======================================
          NOTIFICATIONS
      ====================================== */}

      <div className="notifications-list">

        {notifications.length === 0 ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔔
            </div>

            <h2>
              No notifications
            </h2>

            <p>
              You're all caught up.
            </p>

          </div>

        ) : (

          notifications.map(
            notification => (

              <div
                key={notification.id}
                className={
                  notification.unread
                    ? "notification-card unread"
                    : "notification-card"
                }
              >

                <div className="notification-icon">
                  {notification.icon}
                </div>


                <div className="notification-content">

                  <div className="notification-title-row">

                    <h2>
                      {notification.title}
                    </h2>

                    {notification.unread && (
                      <span className="unread-dot">
                      </span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>


                {notification.unread && (

                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                  >
                    Mark as read
                  </button>

                )}

              </div>

            )
          )

        )}

      </div>


    </div>

  );

};


export default Notifications;