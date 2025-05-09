import ProfileSection from '../../components/mylibrary/ProfileSection';
import BookmarkSection from "../../components/mylibrary/BookmarkSection.jsx";
import CalendarSection from "../../components/mylibrary/CalendarSection.jsx";
const MyLibraryPage = () => {
    return (
        <div>
            <ProfileSection />
            <BookmarkSection />
            <CalendarSection />
        </div>
    );
};

export default MyLibraryPage;
