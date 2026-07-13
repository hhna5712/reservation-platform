#!/bin/bash
# AI Space 배포 스크립트

echo "🚀 Reservation Platform - AI Space 배포 시작"
echo ""

# 프로젝트 디렉토리로 이동
cd "$(dirname "$0")"

# 1. 압축 파일 생성
echo "📦 배포 파일 생성 중..."
tar -czf ../reservation-platform-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  .

if [ $? -eq 0 ]; then
  echo "✅ 배포 파일 생성 완료: reservation-platform-deploy.tar.gz"
else
  echo "❌ 배포 파일 생성 실패"
  exit 1
fi

echo ""
echo "📋 다음 단계를 진행하세요:"
echo ""
echo "1. AI Space 콘솔 접속:"
echo "   https://hosting.cafe24.com/?controller=myservice_aispace_main&method=spaces"
echo ""
echo "2. 새 프로젝트 생성:"
echo "   - 이름: reservation-platform"
echo "   - 런타임: Node.js 20"
echo "   - 데이터베이스: PostgreSQL"
echo ""
echo "3. 파일 업로드:"
echo "   $(pwd)/../reservation-platform-deploy.tar.gz"
echo ""
echo "4. 환경변수 설정:"
echo "   JWT_SECRET=res-platform-secure-key-2026"
echo "   NEXT_PUBLIC_APP_URL=https://yourname-reservation-platform.mycafe24.ai"
echo ""
echo "5. 배포 완료 후 마이그레이션:"
echo "   npm run db:generate && npm run db:migrate"
echo ""
echo "🎉 배포 준비 완료!"
