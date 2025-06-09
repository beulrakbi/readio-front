import { configureStore } from '@reduxjs/toolkit';
import { logger } from "redux-logger/src";
import rootReducers from './modules/index.js';

const Store = configureStore ({
    reducer: rootReducers,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: true, // 개발환경이면 true, 배포 시 false로 바꿔도 됨
}
);

export default Store;