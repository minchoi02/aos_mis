# AOS 연계 MIS 대시보드

업로드된 대시보드 디자인을 React + Vite + Tailwind CSS로 구현한 프로젝트입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 빌드

```bash
npm run build
npm run preview
```

## 구성

- `src/App.jsx` : 인증 게이트 + 전체 레이아웃 (사이드바 + 헤더 + 본문 + 상세 패널)
- `src/components/LoginPage.jsx` : 로그인 화면 (실시간 시계, 서버 연결 상태 표시)
- `src/hooks/useAuth.js` : 로그인/로그아웃/세션 유지 상태 관리
- `src/components/Sidebar.jsx` : 좌측 아코디언 메뉴
- `src/components/TopHeader.jsx` : 상단 헤더 (실시간 토글, 새로고침, 알림, 로그인 사용자/로그아웃)
- `src/components/StatCards.jsx` : 상단 5개 요약 카드 (실시간 갱신 시 하이라이트)
- `src/components/DailyTrendChart.jsx` : 일별 접수 현황 (영역 차트, recharts)
- `src/components/StatusDonutChart.jsx` : 상태별 비율 (도넛 차트, recharts)
- `src/components/PartsBarChart.jsx` : 부품구분별 현황 (막대 차트, recharts)
- `src/components/ReceiptTable.jsx` : AOS 접수 목록 테이블 + 실제 동작하는 검색 필터 + 페이지네이션
- `src/components/DetailPanel.jsx` : 우측 AOS 접수 상세 정보 패널 + 연계 재전송 동작
- `src/hooks/useLiveDashboard.js` : 실시간 데이터 생성/갱신 로직 (신규 접수, 상태 전이 등)
- `src/data.js` : 참조 데이터 및 목업 생성기

## 로그인

앱 실행 시 로그인 화면이 먼저 표시됩니다. 데모 계정:

| 아이디 | 비밀번호 |
|---|---|
| admin | admin1234 |
| tvulcan | tvulcan1! |

- "로그인 상태 유지"를 체크하면 `localStorage`에 세션이 저장되어 새로고침해도 로그인이 유지됩니다.
- 우측 상단 프로필 영역을 클릭하면 로그아웃할 수 있습니다.
- 계정 정보는 `src/hooks/useAuth.js`의 `VALID_USERS` 배열에서 추가/수정할 수 있습니다. 실제 운영 환경에서는 이 부분을 서버 인증(API 호출)으로 교체하세요.

## 실시간 동작

- 헤더의 `실시간 ON/OFF` 토글을 켜면 3.5초마다 자동으로 신규 접수가 생기거나 기존 접수의 상태가 바뀝니다.
- 상단 통계 카드, 3개 차트(일별 추이/상태별 비율/부품구분별 현황), 접수 목록이 모두 같은 데이터에서 계산되어 함께 갱신됩니다.
- 접수 목록의 검색(접수번호/차량번호/부품구분/상태) → 조회/초기화 버튼이 실제로 동작하며, 페이지네이션도 필터링된 결과 기준으로 작동합니다.
- 상세 패널의 "연계 재전송" 버튼을 누르면 로딩 상태 후 상태/이력이 갱신됩니다.
- 갱신 주기, 신규 접수 확률, 상태 전이 확률은 `src/hooks/useLiveDashboard.js` 상단 상수에서 조정할 수 있습니다.

## 주요 기술

- React 18 + Vite
- Tailwind CSS
- recharts (차트)
- lucide-react (아이콘)

## 이미지 / 네트워크 설정

- 휠·헤드램프 이미지는 `public/images/wheel.jpg`, `public/images/headlamp.jpg`에 있습니다. 실제 사진으로 교체하려면 같은 이름으로 파일만 덮어쓰면 됩니다.
- 이미지 URL과 서버 IP는 `src/data.js`의 `serverConfig`에서 관리합니다.
  ```js
  export const serverConfig = {
    ip: '192.168.0.5',   // 같은 네트워크의 다른 PC에서 접속할 로컬 IP
    port: 5173,
    imagesPath: '/images',
  }
  ```
- 상세 패널(우측)에는 이미지 아래에 `http://192.168.0.5:5173/images/wheel.jpg` 형식의 전체 URL이 함께 표시되고, "4. 이미지 정보" 제목 옆에 서버 IP 뱃지(`192.168.0.5:5173`)가 표시됩니다.
- `vite.config.js`에 `server.host: true`가 설정되어 있어 `npm run dev` 실행 시 같은 네트워크의 다른 PC(예: `http://192.168.0.5:5173`)에서도 접속할 수 있습니다.
- IP나 포트가 바뀌면 `serverConfig` 값만 수정하면 이미지 경로 표시가 자동으로 갱신됩니다.

## 참고

- 목업 데이터는 `src/data.js`에서 자유롭게 수정할 수 있습니다.
