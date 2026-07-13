'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Business {
  id: string;
  name: string;
  category?: string;
  status: string;
  createdAt: string;
}

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/business', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load businesses');
      }

      setBusinesses(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800';

    const labels = {
      active: '활성',
      pending: '대기중',
      suspended: '정지',
      rejected: '거부됨',
    }[status] || status;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
        {labels}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">업체 관리</h1>
                <p className="mt-2 text-gray-600">
                  등록한 업체를 관리하고 서비스를 추가하세요
                </p>
              </div>
              <Button onClick={() => router.push('/business/register')}>
                + 새 업체 등록
              </Button>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="p-8">
            {businesses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">등록된 업체가 없습니다</p>
                <Button onClick={() => router.push('/business/register')}>
                  첫 업체 등록하기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/business/${business.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {business.name}
                      </h3>
                      {getStatusBadge(business.status)}
                    </div>
                    {business.category && (
                      <p className="text-sm text-gray-600 mb-2">
                        {business.category}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      등록일: {new Date(business.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
