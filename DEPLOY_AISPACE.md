# AI Space 배포 가이드

## 배포 준비

### 1. AI Space 웹콘솔 접속
https://hosting.cafe24.com/?controller=new_product_page&page=ai-space

### 2. 빈 공간 확인
- 공간이 없으면 먼저 공간을 생성하세요
- 빈 공간이 있는지 확인하세요

### 3. 프로젝트 압축
```bash
cd reservation-platform
tar -czf reservation-platform.tar.gz \
  package.json \
  package-lock.json \
  next.config.js \
  tsconfig.json \
  tailwind.config.ts \
  postcss.config.js \
  drizzle.config.ts \
  .env.example \
  src
```

## AI Space CLI로 배포

### 1. CLI 설치 (이미 설치되어 있을 수 있음)
```bash
npm install -g @cafe24/aispace-cli
```

### 2. 로그인
```bash
aispace login
```

### 3. 프로젝트 배포
```bash
cd reservation-platform

# 새 프로젝트로 배포
aispace deploy \
  --name reservation-platform \
  --runtime nodejs \
  --database postgresql
```

### 4. 환경변수 설정
배포 후 AI Space 콘솔 또는 CLI로 환경변수 설정:

```bash
# DATABASE_URL은 PostgreSQL 옵션 추가 시 자동 설정됨
aispace env set JWT_SECRET="your-super-secret-jwt-key"
aispace env set NEXT_PUBLIC_APP_URL="https://your-user-id-reservation-platform.mycafe24.ai"
```

## 웹콘솔로 배포 (추천)

### 1. AI Space 콘솔 접속
https://hosting.cafe24.com/?controller=new_product_page&page=ai-space

### 2. 새 프로젝트 만들기
- 프로젝트 이름: `reservation-platform`
- 런타임: `Node.js 20`
- 데이터베이스: `PostgreSQL` 체크

### 3. 파일 업로드
압축 파일(`reservation-platform.tar.gz`)을 업로드하거나,
프로젝트 폴더를 직접 드래그 앤 드롭

### 4. 환경변수 설정
콘솔에서 다음 환경변수 추가:
- `JWT_SECRET`: 랜덤 문자열 (예: `your-super-secret-jwt-key-change-in-production`)
- `NEXT_PUBLIC_APP_URL`: 배포된 URL (예: `https://yourname-reservation-platform.mycafe24.ai`)
- `DATABASE_URL`: PostgreSQL 옵션 선택 시 자동 설정됨

### 5. 배포 시작
"배포" 버튼 클릭

### 6. 데이터베이스 마이그레이션
배포 후 SSH 접속 또는 콘솔에서 실행:
```bash
npm run db:generate
npm run db:migrate
```

## 배포 후 확인

### 1. 사이트 접속
`https://{your-user-id}-reservation-platform.mycafe24.ai`

### 2. 상태 확인
```bash
aispace status
```

### 3. 로그 확인
```bash
aispace logs --tail
```

## 환경변수 확인사항

반드시 설정해야 하는 환경변수:
- ✅ `DATABASE_URL` - PostgreSQL 연결 (자동 설정)
- ✅ `JWT_SECRET` - JWT 시크릿 키
- ✅ `NEXT_PUBLIC_APP_URL` - 앱 URL

## 트러블슈팅

### 빌드 오류
```bash
# 로컬에서 먼저 빌드 테스트
npm run build
```

### 데이터베이스 연결 오류
- PostgreSQL 옵션이 활성화되어 있는지 확인
- `DATABASE_URL` 환경변수가 설정되어 있는지 확인

### 앱이 시작되지 않음
- `npm start` 명령이 정상 작동하는지 로컬에서 확인
- 포트 3000이 정상적으로 사용되는지 확인

## 업데이트

코드 수정 후 재배포:
```bash
aispace deploy --update
```

또는 콘솔에서 "재배포" 버튼 클릭

## 참고
- AI Space 문서: https://docs.cafe24.com/ai-space
- Next.js 배포 가이드: https://nextjs.org/docs/deployment
