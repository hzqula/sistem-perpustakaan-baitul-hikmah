"use client";

import dynamic from "next/dynamic";
import { Pie, Label, Cell } from "recharts";

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  {
    ssr: false,
  }
);

interface CardLeaderboardMuridProps {
  name: string;
  kelas: string;
  booksRead: number;
  totalBooksToRead: number;
  className?: string;
}
const CardLeaderboardMurid = ({
  name,
  kelas,
  booksRead,
  totalBooksToRead,
}: CardLeaderboardMuridProps) => {
  // Prepare data for donut chart
  const chartData = [
    { name: "Read", value: booksRead },
    { name: "Unread", value: totalBooksToRead - booksRead },
  ];

  // Color scheme
  const BG_COLORS = ["#055A39", "#064359", "#C50043"];
  const GRADIENT = ["#adf7b6", "#a0ced9", "#ffc09f"];
  const COLORS = ["#055A39", "#adf7b6"];

  return (
    <div
      className={`rounded-lg bg-white-custom border-jewel-green border-2 px-8 py-1 w-full gap-4 flex items-center`}
    >
      {/* Info Section */}
      <div className="flex flex-col justify-center flex-grow ">
        <p className="text-xs text-gray-600">{kelas}</p>
        <h2 className="text-sm font-source-serif leading-none font-bold">
          {name}
        </h2>
      </div>

      {/* Chart Section */}
      <div className="flex-shrink-0">
        <PieChart width={48} height={66}>
          <Pie
            data={chartData}
            cx={20}
            cy={28}
            innerRadius={8}
            outerRadius={24}
            cornerRadius={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value={`${booksRead}/${totalBooksToRead}`}
              position="end"
              className="text-xs font-black"
              fill="#fff"
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default CardLeaderboardMurid;
