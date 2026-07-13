# 🚀 초간단 AI Space 배포 (3단계)

## ✅ 준비된 파일
```
C:\Users\win10_original\reservation-platform-deploy.tar.gz (61KB)
```

---

## 📋 3단계 배포

### 1단계: AI Space 콘솔 열기
**링크를 클릭하세요:**
https://hosting.cafe24.com/?controller=myservice_aispace_main&method=spaces

### 2단계: 프로젝트 만들기
콘솔에서:
1. **"새 프로젝트"** 또는 **"배포"** 버튼 클릭
2. 다음 정보 입력:
   ```
   프로젝트 이름: reservation-platform
   런타임: Node.js 20
   ```
3. **데이터베이스:**
   - ✅ PostgreSQL 체크
4. **파일 업로드:**
   - 위 tar.gz 파일을 드래그 앤 드롭
   - 또는 "파일 선택"으로 업로드
5. **환경변수 추가:**
   ```
   JWT_SECRET = res-platform-secure-key-2026
   NEXT_PUBLIC_APP_URL = (나중에 설정)
   ```
6. **"배포" 버튼 클릭**

### 3단계: 마이그레이션 (배포 완료 후)
AI Space 콘솔의 터미널에서:
```bash
npm run db:generate && npm run db:migrate
```

---

## 🎉 완료!

배포된 URL:
```
https://{your-id}-reservation-platform.mycafe24.ai
```

그 URL을 복사해서 환경변수 `NEXT_PUBLIC_APP_URL`에 다시 설정하세요.

---

## ❓ 문제 해결

### "빈 공간이 없습니다"
→ AI Space 콘솔에서 먼저 "공간 추가" 필요

### "파일 업로드 실패"
→ 인터넷 연결 확인, 다시 시도

### "빌드 실패"
→ 로그 확인하고 오류 메시지 공유

### "데이터베이스 연결 안 됨"
→ PostgreSQL 체크박스가 체크되었는지 확인
