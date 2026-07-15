# 🚀 GitHub 연동 AI Space 자동 배포

## ✅ 준비 완료
- Git 초기화 완료
- 72개 파일 커밋 완료
- 4,827줄 코드

---

## 📋 GitHub 연동 배포 단계

### 1단계: GitHub 저장소 생성

**1. GitHub 웹사이트 접속**
https://github.com/new

**2. 저장소 정보 입력**
```
Repository name: reservation-platform
Description: Full-stack reservation platform with Next.js, PostgreSQL, and AI features
Public or Private: 선택
```

**3. "Create repository" 클릭**

---

### 2단계: 코드 Push

GitHub에서 제공하는 명령어 실행:

```bash
cd C:\Users\win10_original\reservation-platform

# 원격 저장소 추가
git remote add origin https://github.com/YOUR-USERNAME/reservation-platform.git

# Push
git branch -M main
git push -u origin main
```

---

### 3단계: AI Space - GitHub 연동

**1. AI Space 콘솔 접속**
https://hosting.cafe24.com/?controller=myservice_aispace_main&method=spaces

**2. "새 프로젝트" 클릭**

**3. GitHub 연동 선택**
- "GitHub에서 가져오기" 또는 "GitHub 연동" 선택
- GitHub 계정 인증
- 저장소 선택: `reservation-platform`
- 브랜치: `main`

**4. 프로젝트 설정**
```
프로젝트 이름: reservation-platform
런타임: Node.js 20
빌드 명령: npm install && npm run build
시작 명령: npm start
데이터베이스: PostgreSQL ✓
```

**5. 환경변수 설정**
```
JWT_SECRET=res-platform-secure-key-2026
NEXT_PUBLIC_APP_URL=(배포 후 URL)
```

**6. "배포" 클릭**

---

### 4단계: 자동 배포 확인

이제부터 GitHub `main` 브랜치에 Push할 때마다:
✅ AI Space가 자동으로 감지
✅ 자동으로 빌드
✅ 자동으로 배포

---

## 🔄 업데이트 방법

코드 수정 후:

```bash
cd C:\Users\win10_original\reservation-platform

git add .
git commit -m "Update: 변경 내용"
git push origin main
```

→ AI Space가 자동으로 재배포!

---

## 🎯 배포된 기능

### 완전한 MVP (1-7단계)
- ✅ 23개 PostgreSQL 테이블
- ✅ 26개 API 엔드포인트
- ✅ JWT 인증 시스템
- ✅ 예치금/포인트 시스템
- ✅ 업체 등록 및 관리
- ✅ 예약 시스템 (생성/확정/취소/완료)
- ✅ 타임라인 관리 (여행 일정, 자동 거리/시간 계산)

---

## 📱 배포 URL

```
https://{your-id}-reservation-platform.mycafe24.ai
```

---

## 💡 GitHub 연동의 장점

1. **자동 배포**: Push만 하면 자동으로 배포
2. **버전 관리**: Git으로 모든 변경사항 추적
3. **협업 용이**: 팀원과 함께 개발 가능
4. **롤백 간편**: 이전 커밋으로 쉽게 되돌리기
5. **CI/CD**: 자동 빌드/테스트/배포

---

## 🆘 문제 해결

### Push 실패
```bash
# GitHub 인증 필요
# Personal Access Token 생성 후 사용
```

### 자동 배포 안 됨
- AI Space 콘솔에서 GitHub 연동 상태 확인
- Webhook 설정 확인

### 빌드 오류
- AI Space 로그 확인
- 환경변수 설정 확인

---

## 📚 다음 단계

1. GitHub 저장소 생성
2. 코드 Push
3. AI Space - GitHub 연동
4. 환경변수 설정
5. 자동 배포 확인!

---

**준비됐습니다! 이제 GitHub 저장소만 만들면 됩니다!** 🚀
