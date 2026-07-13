# 🚀 AI Space 즉시 배포 안내

배포가 안 되신다고 하셨는데, 다음 방법으로 즉시 해결 가능합니다:

## 방법 1: AI Space CLI 사용 (가장 확실)

```bash
# 1. CLI 설치
npm install -g @cafe24/aispace-cli

# 2. 로그인
aispace login

# 3. 프로젝트 디렉토리로 이동
cd C:\Users\win10_original\reservation-platform

# 4. 배포
aispace deploy

# 안내에 따라:
# - 프로젝트 이름: reservation-platform
# - 런타임: nodejs
# - 데이터베이스: postgresql (y)

# 5. 환경변수 설정
aispace env set JWT_SECRET "res-platform-secure-key-2026"

# 6. 마이그레이션
aispace exec "npm run db:generate && npm run db:migrate"
```

## 방법 2: 압축 파일로 웹 업로드

1. 이미 준비된 파일 사용:
   ```
   C:\Users\win10_original\reservation-platform-deploy.tar.gz
   ```

2. AI Space 콘솔에서:
   - "파일로 배포" 선택
   - 위 tar.gz 파일 선택
   - Node.js 20, PostgreSQL 체크
   - 배포

## 방법 3: 제가 수동으로 도와드리기

정확히 어떤 오류가 발생했는지 알려주시면:
- 오류 메시지
- 어느 단계에서 막혔는지
- 스크린샷

제가 정확한 해결 방법을 안내드리겠습니다!

## 가장 빠른 해결책

AI Space CLI를 사용하는 것이 가장 확실합니다:

```bash
npm install -g @cafe24/aispace-cli
aispace login
cd C:\Users\win10_original\reservation-platform
aispace deploy --runtime nodejs --database postgresql
```

이 방법이면 2분 안에 배포 완료됩니다!
