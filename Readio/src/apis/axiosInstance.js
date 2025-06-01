import axios from "axios";

// 해당 파일 변경하시면 안됩니다!!!! (보경)
// 공통적으로 axios 인스턴스를 사용하여 Authorization 헤더를 자동 추가함
// 👉 다른 일반 페이지(예: 메인, 로그인, 회원가입 등)은 axios 인스턴스 없이 처리
// 👉 필요 시 axiosInstance.get('/api/endpoint')로 요청하시면 됩니다.
// 수동으로 헤더 추가 가능

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // 백엔드 주소에 맞게 변경
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 문제 해결 및 쿠키 전송을 위해 추가
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken'); // 토큰 저장 위치에 맞게 변경
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 변경 금지
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (여기서 403 처리 추가)
// axiosInstance 사용했을때 403 에러 뜨면 403에러(/access-denied) 페이지로 이동됨
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      window.location.href = '/access-denied'; // 리디렉션 (useNavigate 못 쓰므로 window.location 사용)
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;