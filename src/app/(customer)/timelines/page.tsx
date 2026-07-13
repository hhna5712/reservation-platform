'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Timeline {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export default function TimelinesPage() {
  const router = useRouter();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    loadTimelines();
  }, []);

  const loadTimelines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/timelines', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load timelines');
      }

      setTimelines(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/timelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create timeline');
      }

      alert('타임라인이 생성되었습니다!');
      setShowCreate(false);
      setFormData({ title: '', startDate: '', endDate: '', description: '' });
      loadTimelines();
    } catch (err: any) {
      alert(err.message);
    }
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
                <h1 className="text-3xl font-bold text-gray-900">내 타임라인</h1>
                <p className="mt-2 text-gray-600">일정을 계획하고 관리하세요</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => router.push('/dashboard')}>
                  대시보드로
                </Button>
                <Button onClick={() => setShowCreate(!showCreate)}>
                  + 새 타임라인
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {showCreate && (
            <div className="mx-8 mt-6 p-6 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold mb-4">새 타임라인 만들기</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="제목"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="여행 일정"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="시작일"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="종료일"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    생성
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="p-8">
            {timelines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">타임라인이 없습니다</p>
                <Button onClick={() => setShowCreate(true)}>
                  첫 타임라인 만들기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timelines.map((timeline) => (
                  <div
                    key={timeline.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/timelines/${timeline.id}`)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {timeline.title}
                    </h3>
                    {timeline.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {timeline.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(timeline.startDate).toLocaleDateString('ko-KR')} -{' '}
                      {new Date(timeline.endDate).toLocaleDateString('ko-KR')}
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
