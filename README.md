# 철인3종 계산기 - 무료 배포 가이드

by Ian Kwon | Ver 1.0

## 📱 Vercel로 무료 배포하기 (가장 쉬운 방법)

### 1단계: GitHub 계정 만들기
1. https://github.com 접속
2. "Sign up" 클릭
3. 이메일, 비밀번호 입력하여 계정 생성

### 2단계: 새 Repository 만들기
1. GitHub 로그인 후 우측 상단 "+" 클릭
2. "New repository" 선택
3. Repository name: `triathlon-calculator` 입력
4. Public 선택
5. "Create repository" 클릭

### 3단계: 파일 업로드
1. 생성된 repository 페이지에서 "uploading an existing file" 클릭
2. 다음 파일들을 모두 드래그해서 업로드:
   - package.json
   - vite.config.js
   - tailwind.config.js
   - postcss.config.js
   - index.html
   - src 폴더 (전체)
   - public 폴더 (전체)

3. 하단에 "Commit changes" 클릭

### 4단계: Vercel에 배포
1. https://vercel.com 접속
2. "Start Deploying" 또는 "Sign Up" 클릭
3. "Continue with GitHub" 선택
4. GitHub 계정으로 로그인 허용
5. "Import Project" 클릭
6. GitHub에서 만든 `triathlon-calculator` repository 선택
7. "Import" 클릭
8. Framework Preset: "Vite" 자동 선택됨
9. "Deploy" 클릭
10. 약 1-2분 대기 → 배포 완료! 🎉

### 5단계: 앱처럼 사용하기

**iPhone/iPad:**
1. Safari에서 배포된 URL 접속
2. 하단 공유 버튼 클릭
3. "홈 화면에 추가" 선택
4. 이름 확인 후 "추가" 클릭
5. 홈 화면에 앱 아이콘 생성됨!

**Android:**
1. Chrome에서 배포된 URL 접속
2. 우측 상단 메뉴(⋮) 클릭
3. "홈 화면에 추가" 선택
4. 이름 확인 후 "추가" 클릭
5. 홈 화면에 앱 아이콘 생성됨!

## 🔗 지인과 공유하기
- Vercel에서 생성된 URL(예: https://triathlon-calculator.vercel.app)을 복사
- 카카오톡, 문자 등으로 링크 공유
- 받은 사람도 위의 "홈 화면에 추가" 하면 앱처럼 사용 가능!

## 💡 참고사항
- **완전 무료**: Vercel은 개인 프로젝트 무료
- **자동 업데이트**: GitHub에 파일 수정하면 자동으로 반영
- **빠른 속도**: 전세계 어디서나 빠르게 접속
- **모바일 최적화**: 휴대폰에서 앱처럼 작동

## 🆘 도움이 필요하면
- GitHub 업로드가 어려우면: GitHub Desktop 앱 사용
- 배포 오류 발생 시: Vercel 대시보드에서 로그 확인

---

**제작자**: Ian Kwon
**버전**: Ver 1.0
**라이선스**: 개인 사용 및 공유 자유
