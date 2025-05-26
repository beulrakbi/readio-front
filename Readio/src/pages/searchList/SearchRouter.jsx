import { useLocation, useParams } from "react-router-dom";
import SearchBookList from "./SearchBookList";
import SearchVideoList from "./SearchVideoList";

function SearchRouter() {

          const {searchType} = useParams();
          const location = useLocation();
          const queryParams = new URLSearchParams(location.search);
          const query = queryParams.get('query');

          if(!query) {
               return "검색어가 없습니다";
          }

          if(searchType === 'book') {
               return <SearchBookList query = {query} />;
          }

          
          if(searchType === 'video') {
               return <SearchVideoList query = {query} />;
          }

          return "잘못된 검색 타입입니다.";
}

export default SearchRouter;