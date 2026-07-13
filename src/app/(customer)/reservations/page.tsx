'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Reservation {
  id: string;
  business: { name: string };
  service: { name: string };
  reservationDate: string;
  startTime: string;
  status: string;
  totalPrice: string;
}

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load reservations');
      }

      setReservations(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (!confirm('예약을 취소하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cancelReason: '고객 요청' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      alert('예약이 취소되었습니다.');
      loadReservations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800';

    const labels = {
      pending: '대기중',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소됨',
      no_show: '노쇼',
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
                <h1 className="text-3xl font-bold text-gray-900">내 예약</h1>
                <p className="mt-2 text-gray-600">예약 내역을 확인하고 관리하세요</p>
              </div>
              <Button onClick={() => router.push('/dashboard')}>
                대시보드로
              </Button>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="p-8">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">예약 내역이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reservation.business.name}
                          </h3>
                          {getStatusBadge(reservation.status)}
                        </div>
                        <p className="text-gray-700 mb-1">{reservation.service.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(reservation.reservationDate).toLocaleDateString('ko-KR')} •{' '}
                          {new Date(reservation.startTime).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          {parseInt(reservation.totalPrice).toLocaleString()}원
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {reservation.status === 'pending' ||
                        reservation.status === 'confirmed' ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancel(reservation.id)}
                          >
                            취소
                          </Button>
                        ) : null}
                      </div>
                    </div>
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
