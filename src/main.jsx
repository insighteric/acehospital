// React와 ReactDOM을 불러옵니다.
// ReactDOM은 React 컴포넌트를 실제 HTML에 연결해주는 역할을 합니다.
import React from 'react'
import ReactDOM from 'react-dom/client'

// 우리가 만든 설문 폼 컴포넌트를 불러옵니다.
import App from './App.jsx'

// index.html 안에 있는 <div id="root"> 를 찾아서,
// 그 안에 App 컴포넌트를 렌더링합니다.
// 이 파일은 "연결 다리" 역할만 하는 아주 단순한 파일입니다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
