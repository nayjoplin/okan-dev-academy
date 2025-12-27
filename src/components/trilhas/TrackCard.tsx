import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrackCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  coursesCount: number;
  duration: string;
  studentsCount: number;
  color: "coral" | "purple" | "warm";
}

const colorClasses = {
  coral: "bg-primary/10 text-primary border-primary/20",
  purple: "bg-secondary/10 text-secondary border-secondary/20",
  warm: "bg-okan-warm/10 text-okan-warm border-okan-warm/20",
};

const iconBgClasses = {
  coral: "bg-primary text-primary-foreground",
  purple: "bg-secondary text-secondary-foreground",
  warm: "bg-okan-warm text-primary-foreground",
};

const TrackCard = ({
  id,
  title,
  description,
  icon,
  coursesCount,
  duration,
  studentsCount,
  color,
}: TrackCardProps) => {
  return (
    <Link to={`/trilhas/${id}`}>
      <Card className="group h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${iconBgClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={colorClasses[color]}>
              <BookOpen size={12} className="mr-1" />
              {coursesCount} cursos
            </Badge>
            <Badge variant="outline" className={colorClasses[color]}>
              <Clock size={12} className="mr-1" />
              {duration}
            </Badge>
            <Badge variant="outline" className={colorClasses[color]}>
              <Users size={12} className="mr-1" />
              {studentsCount}+
            </Badge>
          </div>

          {/* CTA */}
          <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Ver trilha <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TrackCard;
