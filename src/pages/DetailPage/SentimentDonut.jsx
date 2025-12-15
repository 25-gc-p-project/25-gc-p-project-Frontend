import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function SentimentDonut({
  positiveRatio = 0,
  negativeRatio = 0,
}) {
  const sum = (positiveRatio ?? 0) + (negativeRatio ?? 0);
  const neutral = sum < 100 ? Math.max(0, 100 - sum) : 0;

  const data = [
    { name: '긍정', value: positiveRatio ?? 0 },
    { name: '부정', value: negativeRatio ?? 0 },
    ...(neutral > 0 ? [{ name: '기타', value: neutral }] : []),
  ];

  const COLORS = ['#22c55e', '#ef4444', '#9ca3af'];

  return (
    <div className="w-full max-w-sm rounded-xl border bg-white p-4">
      <div className="text-sm font-medium text-gray-800 mb-2">
        리뷰 감성 요약
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="transparent"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-700">
          긍정 {positiveRatio?.toFixed?.(2) ?? positiveRatio}%
        </span>
        <span className="text-gray-700">
          부정 {negativeRatio?.toFixed?.(2) ?? negativeRatio}%
        </span>
        {neutral > 0 && (
          <span className="text-gray-500">기타 {neutral.toFixed(2)}%</span>
        )}
      </div>
    </div>
  );
}
