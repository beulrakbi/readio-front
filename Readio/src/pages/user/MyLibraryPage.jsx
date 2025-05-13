import ProfileSection from '../mylibrary/mainpage/ProfileSection.jsx';
import BookmarkSection from "../mylibrary/mainpage/BookmarkSection.jsx";
import CalendarSection from "../mylibrary/mainpage/CalendarSection.jsx";
import ReportSection from "../mylibrary/mainpage/ReportSection.jsx"
const MyLibraryPage = () => {
    return (
        <div>
            <ProfileSection />
            <BookmarkSection />
            <CalendarSection />
            <ReportSection />
        </div>
    );
};

export default MyLibraryPage;
