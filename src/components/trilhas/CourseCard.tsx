import { Link } from "react-router-dom";
import { Clock, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  trackId: string;
  title: string;
  description: string;
  modulesCount: number;
  duration: string;
  progress?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
}

const CourseCard = ({
  id,
  trackId,
  title,
  description,
  modulesCount,
  duration,
  progress = 0,
  isLocked = false,
  isCompleted = false,
}: CourseCardProps) => {
  if (isLocked) {
    return (
      <Card className="h-full border-2 border-dashed border-muted opacity-60 cursor-not-allowed">
        <CardContent className="p-6 relative">
          <div className="absolute top-4 right-4">
            <Lock size={20} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
          <Badge variant="outline" className="text-muted-foreground">
            Complete o curso anterior para desbloquear
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/trilhas/${trackId}/cursos/${id}`}>
      <Card className={`group h-full border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${isCompleted ? 'border-okan-success/50 bg-okan-success/5' : 'hover:border-primary/50'}`}>
        <CardContent className="p-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            {isCompleted ? (
              <Badge className="bg-okan-success text-primary-foreground">
                <CheckCircle2 size={12} className="mr-1" />
                Concluído
              </Badge>
            ) : progress > 0 ? (
              <Badge variant="outline" className="border-primary text-primary">
                Em andamento
              </Badge>
            ) : (
              <Badge variant="outline">Novo</Badge>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {modulesCount} módulos
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {duration}
            </span>
          </div>

          {/* Progress */}
          {progress > 0 && !isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
