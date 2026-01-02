import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Search, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp,
  Send,
  Pin
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function MentorDiscussions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["mentor-all-discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          *,
          course:courses(title, slug),
          profile:profiles!discussions_user_id_fkey(full_name),
          replies:discussion_replies(
            id,
            content,
            is_solution,
            created_at,
            user_id,
            profile:profiles!discussion_replies_user_id_fkey(full_name)
          )
        `)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ discussionId, content }: { discussionId: string; content: string }) => {
      const { error } = await supabase
        .from("discussion_replies")
        .insert({
          discussion_id: discussionId,
          user_id: user?.id,
          content,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-all-discussions"] });
      setReplyContent("");
      toast.success("Resposta enviada!");
    },
    onError: () => {
      toast.error("Erro ao enviar resposta");
    },
  });

  const filteredDiscussions = discussions?.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.content.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleReply = (discussionId: string) => {
    if (!replyContent.trim()) return;
    replyMutation.mutate({ discussionId, content: replyContent });
  };

  return (
    <AppLayout
      title="Discussões"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Discussões" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Discussões</h1>
            <p className="text-muted-foreground mt-1">
              Responda dúvidas e interaja com as alunas
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar discussões..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDiscussions.length > 0 ? (
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => {
              const isExpanded = expandedId === discussion.id;
              const replies = (discussion as any).replies || [];
              
              return (
                <Card key={discussion.id} className={discussion.is_pinned ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.is_pinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          <Badge variant="secondary">
                            {(discussion as any).course?.title}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(discussion.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{discussion.title}</h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <User className="h-4 w-4" />
                          {(discussion as any).profile?.full_name || "Aluna"}
                        </div>
                        
                        <p className="text-muted-foreground">{discussion.content}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(isExpanded ? null : discussion.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {replies.length}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t space-y-4">
                        {replies.length > 0 ? (
                          <div className="space-y-3">
                            {replies.map((reply: any) => (
                              <div 
                                key={reply.id} 
                                className={`p-4 rounded-lg ${
                                  reply.is_solution 
                                    ? "bg-okan-success/10 border border-okan-success/20" 
                                    : "bg-muted/50"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-sm">
                                    {reply.profile?.full_name || "Usuário"}
                                  </span>
                                  {reply.is_solution && (
                                    <Badge className="bg-okan-success">Solução</Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(reply.created_at), { 
                                      addSuffix: true, 
                                      locale: ptBR 
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            Nenhuma resposta ainda
                          </p>
                        )}
                        
                        {/* Reply Form */}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Escreva sua resposta..."
                            value={expandedId === discussion.id ? replyContent : ""}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <Button
                            onClick={() => handleReply(discussion.id)}
                            disabled={!replyContent.trim() || replyMutation.isPending}
                            className="shrink-0"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {search ? "Nenhuma discussão encontrada" : "Nenhuma discussão ainda"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {search 
                  ? "Tente buscar por outros termos" 
                  : "As discussões das alunas aparecerão aqui"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
