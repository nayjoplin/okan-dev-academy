import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const StatsCard = ({ value, label, icon }: StatsCardProps) => {
  return (
    <Card className="border-2 hover:border-primary/30 transition-colors">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
