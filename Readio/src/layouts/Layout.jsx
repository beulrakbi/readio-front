// src/layouts/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header.jsx'; // Header 컴포넌트 임포트 (경로 확인)
import UserNav from '../components/common/UserNav.jsx'; // UserNav 컴포넌트 임포트 (경로 확인)
import LayoutCSS from './Layout.module.css'; // 필요하다면 레이아웃 CSS 임포트

// App.js에서 전달받을 props를 정의합니다.
// isNavOpen, setIsOpen, toggleNav를 props로 받습니다.
function Layout({ isNavOpen, setIsOpen, toggleNav }) {
    return (
        <div className={LayoutCSS.layoutContainer}> {/* 필요하다면 클래스 추가 */}
            {/* Header와 UserNav를 여기서 렌더링 */}
            <Header toggleNav={toggleNav} setIsOpen={setIsOpen} />
            <UserNav isOpen={isNavOpen} setIsOpen={setIsOpen} />

            {/* 중첩된 라우트의 내용이 표시될 부분 */}
            <main className={LayoutCSS.main}> {/* 필요하다면 클래스 추가 */}
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;