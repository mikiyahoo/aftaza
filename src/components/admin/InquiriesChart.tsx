import { useEffect, useState } from 'react';

export default function InquiriesChart({ data }: { data: { month: string; inquiries: number }[] }) {
  const [chartData, setChartData] = useState<{ month: string; inquiries: number }[]>([]);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Inquiries Over Time</h3>
      <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Chart visualization would appear here</div>
          <div className="text-sm text-gray-400">
            Data: {data.length} months of inquiry data
          </div>
        </div>
      </div>
    </div>
  );
}