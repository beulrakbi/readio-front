import ProfileSection from '../../components/mylibrary/mainpage/ProfileSection.jsx';
import BookmarkSection from "../../components/mylibrary/mainpage/BookmarkSection.jsx";
import CalendarSection from "../../components/mylibrary/mainpage/CalendarSection.jsx";
import ReportSection from "../../components/mylibrary/mainpage/ReportSection.jsx"
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
