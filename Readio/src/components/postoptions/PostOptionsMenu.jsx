import { useEffect,useRef } from 'react';
import PostCSS from '../../pages/post/Post.module.css';
import postDetailOption from '../../assets/postDetailOption.png';

function PostOptionsMenu({ postId, isPostOwner, loggedInUserId, onEdit, onDelete, onReport }) {
    const detailsRef = useRef(null);

    // 드롭다운 메뉴를 닫는 함수
    const closeMenu = () => {
        if (detailsRef.current) {
            detailsRef.current.open = false;
        }
    };

    useEffect(() => {
        const handleClickOut = (event) => {
            if (detailsRef.current && detailsRef.current.open && !detailsRef.current.contains(event.target)) {
                detailsRef.current.open = false;
            }
        };
        document.addEventListener('mousedown', handleClickOut);
        return () => {
            document.removeEventListener('mousedown', handleClickOut);
        };
    }, []);

    // "수정하기" 옵션 클릭 시 실행될 함수
    const handleEditClick = () => {
        closeMenu();
        if (onEdit) onEdit();
    };

    // "삭제하기" 옵션 클릭 시 실행될 함수
    const handleDeleteClick = () => {
    closeMenu();
    if (onDelete) {
        onDelete();
    }
    };

    // "신고하기" 옵션 클릭 시 실행될 함수
    const handleReportClick = () => {
        closeMenu();
        if (!loggedInUserId) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }        if (onReport) onReport(postId);
    };

    let optionsToShow = null;

    if (loggedInUserId) {
        if (isPostOwner) {
            optionsToShow = (
                <>
                    {onEdit && <p className={PostCSS.postOptionModify} onClick={handleEditClick}>수정하기</p>}
                    {onDelete && <p className={PostCSS.postOptionDelete} onClick={handleDeleteClick}>삭제하기</p>}
                </>
            );
        } else {
            if (onReport) {
                 optionsToShow = <p className={PostCSS.postOptionReport} onClick={handleReportClick}>신고하기</p>;
            }
        }
    } else {

        if (onReport) { 
            optionsToShow = <p className={PostCSS.postOptionReport} onClick={handleReportClick}>신고하기</p>;
        }
    }
    
    if (!optionsToShow) {
        return null; 
    }

    return (
        <details ref={detailsRef} className={PostCSS.detailsElement} style={{ position: 'relative', display: 'inline-block' }}>
            <summary className={PostCSS.postDetailOptionbt}>
                <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption} />
            </summary>
            <div className={PostCSS.postOptionList}>
                {optionsToShow}
            </div>
        </details>
    );
}

export default PostOptionsMenu;