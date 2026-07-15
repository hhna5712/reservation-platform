# 🚀 AI Space - GitHub 연동 가이드

## ✅ 완료된 작업
- [x] GitHub 저장소 생성
- [x] 코드 Push 완료
- **저장소**: https://github.com/hhna5712/reservation-platform

---

## 📋 AI Space 연동 단계

### 1단계: AI Space 콘솔 접속
👉 **https://hosting.cafe24.com/?controller=myservice_aispace_main&method=spaces**

---

### 2단계: 새 프로젝트 생성

**"새 프로젝트" 버튼 클릭**

---

### 3단계: GitHub 연동 선택

**두 가지 방법 중 하나:**

#### 방법 A: GitHub 직접 연동 (추천)
1. "GitHub에서 가져오기" 또는 "GitHub 연동" 선택
2. GitHub 계정 인증 (로그인)
3. 저장소 선택:
   ```
   hhna5712/reservation-platform
   ```
4. 브랜치 선택: `main`

#### 방법 B: Repository URL 입력
```
Repository URL: https://github.com/hhna5712/reservation-platform.git
Branch: main
```

---

### 4단계: 프로젝트 설정

```
프로젝트 이름: reservation-platform

런타임: Node.js 20

빌드 명령어: npm install && npm run build
시작 명령어: npm start
포트: 3000

데이터베이스: ✅ PostgreSQL 체크

환경변수:
  JWT_SECRET=res-platform-secure-key-2026
  NEXT_PUBLIC_APP_URL=https://yourname-reservation-platform.mycafe24.ai
```

---

### 5단계: 배포 시작

**"배포" 또는 "생성" 버튼 클릭!**

배포 진행 상황:
- ✅ GitHub에서 코드 가져오기
- ✅ 의존성 설치 (npm install)
- ✅ 빌드 (npm run build)
- ✅ PostgreSQL 데이터베이스 생성
- ✅ 앱 시작 (npm start)

⏱️ **예상 시간: 3-5분**

---

### 6단계: 배포 완료 후

#### A. URL 확인
배포가 완료되면 다음과 같은 URL을 받습니다:
```
https://{user-id}-reservation-platform.mycafe24.ai
```

#### B. 환경변수 업데이트
AI Space 콘솔에서:
```
NEXT_PUBLIC_APP_URL을 실제 배포된 URL로 업데이트
```

#### C. 데이터베이스 마이그레이션
SSH 터미널 또는 콘솔에서:
```bash
npm run db:generate
npm run db:migrate
```

---

## 🔄 자동 배포 활성화

이제부터 GitHub `main` 브랜치에 Push하면:
1. ✅ AI Space가 자동 감지
2. ✅ 자동으로 빌드
3. ✅ 자동으로 재배포

### 업데이트 방법:
```bash
cd C:\Users\win10_original\reservation-platform

git add .
git commit -m "Update features"
git push origin main
```
→ **자동 배포 시작!**

---

## 📱 배포되는 완전한 시스템

### 백엔드
- ✅ 26개 API 엔드포인트
- ✅ JWT 인증
- ✅ 예치금/포인트 시스템
- ✅ 예약 시스템
- ✅ 타임라인 관리

### 데이터베이스
- ✅ PostgreSQL 23개 테이블
- ✅ Drizzle ORM

### 프론트엔드
- ✅ Next.js 14 + TypeScript
- ✅ 10+ 반응형 페이지

---

## 🎯 체크리스트

- [x] GitHub 저장소 생성
- [x] 코드 Push
- [ ] AI Space 콘솔 접속
- [ ] GitHub 연동 설정
- [ ] 프로젝트 설정 (Node.js 20, PostgreSQL)
- [ ] 환경변수 입력
- [ ] 배포 시작
- [ ] 마이그레이션 실행
- [ ] URL 접속 확인

---

## 💡 팁

1. **PostgreSQL 필수**: 체크하지 않으면 DB 연결 실패
2. **환경변수**: JWT_SECRET은 반드시 설정
3. **마이그레이션**: 배포 후 꼭 실행
4. **자동 배포**: main 브랜치에만 Push

---

## 🆘 문제 해결

### GitHub 연동 실패
- GitHub 계정 권한 확인
- 저장소가 Public인지 확인

### 빌드 실패
- 로그 확인
- package.json 확인

### 데이터베이스 연결 실패
- PostgreSQL 옵션 체크 확인
- DATABASE_URL 환경변수 확인

---

**준비됐습니다! AI Space 콘솔에서 GitHub 연동을 시작하세요!** 🚀

https://hosting.cafe24.com/?controller=myservice_aispace_main&method=spaces
