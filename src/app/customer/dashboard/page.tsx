'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">고객 대시보드</h1>
          <p className="mt-2 text-gray-600">
            예약, 지갑, 타임라인을 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/wallet"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-3xl mb-4">💳</div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">지갑</h2>
            <p className="text-gray-600">예치금과 포인트 관리</p>
          </Link>

          <Link
            href="/reservations"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-3xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold mb-2 text-green-600">예약</h2>
            <p className="text-gray-600">예약 조회 및 관리</p>
          </Link>

          <Link
            href="/timelines"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-3xl mb-4">🗓️</div>
            <h2 className="text-2xl font-semibold mb-2 text-purple-600">타임라인</h2>
            <p className="text-gray-600">일정 계획 및 관리</p>
          </Link>

          <Link
            href="/business/register"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-3xl mb-4">🏢</div>
            <h2 className="text-2xl font-semibold mb-2 text-orange-600">업체 등록</h2>
            <p className="text-gray-600">새로운 업체 등록하기</p>
          </Link>

          <Link
            href="/business/dashboard"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-600">업체 관리</h2>
            <p className="text-gray-600">내 업체 관리</p>
          </Link>
        </div>

        <div className="mt-12 p-8 bg-white rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">시작하기</h3>
          <ol className="space-y-3 text-gray-700">
            <li>1. 지갑에 예치금을 충전하거나 포인트로 전환하세요</li>
            <li>2. 원하는 업체와 서비스를 찾아 예약하세요</li>
            <li>3. 타임라인을 만들어 일정을 계획하세요</li>
            <li>4. 업체를 운영하신다면 업체를 등록해보세요</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
