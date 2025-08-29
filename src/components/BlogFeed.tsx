import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DevToArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  social_image: string | null;
  published_at: string;
  readable_publish_date?: string;
  tag_list: string[];
  reading_time_minutes?: number;
  user?: { name?: string };
};

const TAGS = [
  { value: "mental-health", label: "Mental Health" },
  { value: "wellbeing", label: "Wellbeing" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "meditation", label: "Meditation" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
];

function useDevTo(tag: string, page: number) {
  return useQuery({
    queryKey: ["devto", tag, page],
    queryFn: async (): Promise<DevToArticle[]> => {
      const perPage = 9;
      const res = await fetch(`https://dev.to/api/articles?per_page=${perPage}&page=${page}&tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error(`Failed to load articles (${res.status})`);
      return (await res.json()) as DevToArticle[];
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
}

const BlogFeed = () => {
  const [tag, setTag] = useState<string>(TAGS[0].value);
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching, error } = useDevTo(tag, page);

  const articles = data ?? [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <div className="flex items-center gap-2">
            <Select value={tag} onValueChange={(v) => { setTag(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {TAGS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Auto-updated from public sources (DEV.to) by topic.</p>

        {error && (
          <div className="therapeutic-card p-4 mb-6 text-sm text-red-600">{(error as any)?.message || "Failed to load articles."}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isLoading ? Array.from({ length: 6 }) : articles).map((a: any, idx: number) => (
            <Card key={a?.id ?? idx} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-36 bg-muted/40">
                {a?.social_image ? (
                  <img src={a.social_image} alt={a.title} className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 w-full flex items-center justify-center text-muted-foreground">Loading...</div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-base">{a?.title || "Loading..."}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground mb-2">
                  {a?.user?.name ? `${a.user.name} • ` : ""}
                  {a?.readable_publish_date || (a?.published_at ? new Date(a.published_at).toLocaleDateString() : "")}
                  {a?.reading_time_minutes ? ` • ${a.reading_time_minutes} min` : ""}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{a?.description}</p>
                {a?.url && (
                  <a href={a.url} target="_blank" rel="noreferrer">
                    <Button size="sm" className="w-full">Read Article</Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="outline" disabled={page === 1 || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button disabled={isFetching || (articles.length < 9 && !isLoading)} onClick={() => setPage((p) => p + 1)}>
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogFeed;



