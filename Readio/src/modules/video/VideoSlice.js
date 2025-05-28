import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data:[{
        videoId: '',
        title: '',
        channelTitle: '',
        description: '',
        thumbnail: ''
    }],
    num: 0
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        getVideo: (state, action) => {
            return {
                ...state,
                data: [
                    {
                        videoId: action.payload.videoId,
                        title: action.payload.title,
                        channelTitle: action.payload.channelTitle,
                        description: action.payload.description,
                        thumbnail: action.payload.thumbnail
                    }
                ],
                num: 1
            };
        },
        getVideos: (state, action) => {
            return {
                ...state,
                data: action.payload.videoDTOList, // result.data가 아닌 payload 직접 접근
                num: action.payload.num
            };
        },
        postVideo: (state, action) => {
            state.data.push(action.payload);
        },
        postVideos: (state, action) => {
            state.data.push(...action.payload);
        }
    }
});

export const {
    getVideo,
    getVideos,
    postVideo,
    postVideos
} = videoSlice.actions;

export default videoSlice.reducer;