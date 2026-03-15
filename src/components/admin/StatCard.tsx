import { StatCardProps } from '@/types/admin';

export default function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-between h-full">
      <div className="flex flex-col items-center">
        <div className="text-gray-500 mb-2">{title}</div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
      </div>
      <div className="flex items-center">
        {icon}
        <span className={`ml-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'positive' ? '+' : '-'}{change}%
        </span>
      </div>
    </div>
  );
}