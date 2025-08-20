# 🧵 Nuriwoolim Frontend

누리울림 중앙대학교 민중가요 동아리 공식 웹사이트의 프론트엔드 레포지토리입니다.  
React 기반으로 SPA(Single Page Application)를 구현하고 있으며, styled-components를 활용한 디자인 시스템을 채택하고 있습니다.

---

## 📌 Features

- 🔐 로그인/회원가입 기능
- 🧑‍💼 마이페이지, 사용자 설정
- 📚 공지사항 및 자료실(Archive)
- 🗓 행사 일정 관리 (Calendar)
- 🌐 반응형 디자인
- 🎨 Tailwind-like 유틸리티 스타일링 (styled-components 기반)
- 🧭 Header 드롭다운 메뉴 및 상태 기반 전환 처리

---

## 🛠 Tech Stack

| 영역             | 기술                          |
| ---------------- | ----------------------------- |
| Language         | JavaScript (ES6+)             |
| Framework        | React 18                      |
| Styling          | styled-components             |
| Routing          | React Router                  |
| State Management | LocalStorage, useState        |
| HTTP Client      | Axios                         |
| Dev Tooling      | ESLint, Prettier, VSCode, Git |

---

## 📂 Folder Structure

FRONTEND/
├─ 📂 .vscode/ # VS Code 워크스페이스 설정
├─ 📂 node_modules/ # npm 패키지 (자동 생성)
├─ 📂 assets/ # 정적 리소스 (이미지, 폰트 등)
├─ 📄 index.html # 루트 HTML 템플릿 (public)
├─ ⚙️ manifest.json # PWA manifest (public)
├─ 🤖 robots.txt # 크롤러 접근 제어 (public)
└─ 📂 src/
├─ 📂 apis/ # API 호출 유틸
│ ├─ 📄 authAxios.js
│ └─ 📄 user.js
├─ 📂 data/ # 더미/정적 데이터
│ ├─ 📄 ArchiveData.js
│ └─ 📄 NoticeData.js
├─ 📂 hooks/ # 커스텀 훅
│ └─ 📄 useForm.js # (스크린샷엔 폴더만 보임, 파일 존재 추정)
├─ 📂 layout/ # 공통 레이아웃 래퍼
│ └─ 🧩 Layout.jsx
├─ 📂 pages/ # 라우트 단위 페이지 모음
│ ├─ 📂 accounts/ # 계정 관련 (로그인/가입 등)
│ │ ├─ 🧩 Login.jsx
│ │ └─ 🧩 Signup.jsx
│ ├─ 📂 header/ # 헤더 관련 서브컴포넌트
│ │ ├─ 🧩 Header.jsx
│ │ └─ 🧩 MyPageDropdown.jsx
│ ├─ 🧩 Archive.jsx
│ ├─ 🧩 Calendar.jsx
│ ├─ 🧩 Footer.jsx
│ ├─ 🧩 Main.jsx
│ ├─ 🧩 Notice.jsx
│ └─ 🧩 NoticeDetail.jsx
├─ 📂 style/ # 전역 스타일 / 애니메이션 등
│ ├─ 🎞 fadeIn.jsx
│ └─ 🎨 GlobalStlye.jsx # (오타? GlobalStyle.jsx 추천)
├─ 📄 App.js # 루트 앱 컴포넌트
├─ 🧪 App.test.js # 테스트 (필요 없으면 삭제 가능)
├─ 🎨 index.css # 글로벌 CSS (reset, 폰트 등)
└─ 📄 index.js # React 엔트리 (ReactDOM.render)
