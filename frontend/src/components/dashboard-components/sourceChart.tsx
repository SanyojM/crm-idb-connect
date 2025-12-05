import { COLORS } from "@/lib/color";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie"
type Props = {
  data: Record<string, number>;
};


export default function SourceChart({ data }: Props) {
  const items = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <Card shadow="md" radius="lg">
      <CardHeader>Leads by Source</CardHeader>
      <CardBody style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              {items.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
