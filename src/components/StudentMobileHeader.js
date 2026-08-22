import { FaBars } from "react-icons/fa";

const StudentMobileHeader = ({
  onMenuClick
}) => {

  return (

    <header className="student-mobile-header">

      <button
        type="button"
        className="student-mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open student navigation"
      >

        <FaBars />

      </button>

      <span className="student-mobile-header-title">
        EduLearn
      </span>

    </header>

  );

};

export default StudentMobileHeader;