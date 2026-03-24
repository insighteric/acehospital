import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

정리하면 총 5개의 파일이 필요하고, 폴더 구조는 아래처럼 됩니다.
```
simplit-survey/          ← 프로젝트 루트 폴더
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx          ← 우리가 만든 폼 코드
