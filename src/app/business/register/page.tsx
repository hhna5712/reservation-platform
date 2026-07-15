'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register business');
      }

      alert('업체가 성공적으로 등록되었습니다!');
      router.push('/business/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">업체 등록</h1>
            <p className="mt-2 text-gray-600">
              새로운 업체를 등록하고 서비스를 시작하세요
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="업체명 *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="예: 카페 드 플로"
            />

            <Input
              label="카테고리"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="예: 카페, 레스토랑, 호텔"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업체 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="업체에 대한 설명을 입력하세요"
              />
            </div>

            <Input
              label="주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="서울시 강남구..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="전화번호"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="02-1234-5678"
              />

              <Input
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </div>

            <Input
              label="웹사이트"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? '등록 중...' : '업체 등록'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
