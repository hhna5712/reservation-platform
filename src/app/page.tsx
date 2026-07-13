import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
      <main className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          예약 플랫폼
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          네이버 예약 연동, 타임라인 관리, 예치금/포인트 시스템
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/login"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">로그인</h2>
            <p className="text-gray-600">기존 회원 로그인</p>
          </Link>

          <Link
            href="/signup"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-green-600">회원가입</h2>
            <p className="text-gray-600">새로운 계정 만들기</p>
          </Link>

          <Link
            href="/dashboard"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-purple-600">고객 대시보드</h2>
            <p className="text-gray-600">예약 및 지갑 관리</p>
          </Link>

          <Link
            href="/business/register"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-orange-600">업체 등록</h2>
            <p className="text-gray-600">새로운 업체 등록하기</p>
          </Link>
        </div>

        <div className="mt-16 p-8 bg-blue-50 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">주요 기능</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✅ JWT 기반 인증 시스템</li>
            <li>✅ 예치금/포인트 관리</li>
            <li>✅ 업체 등록 및 관리</li>
            <li>✅ 서비스 관리</li>
            <li>✅ 콘텐츠 업로드</li>
            <li>🔄 예약 시스템 (예정)</li>
            <li>🔄 타임라인 관리 (예정)</li>
            <li>🔄 네이버 예약 연동 (예정)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
