import { BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const BOOKS = [
  {
    id: "mindfulness-basics",
    title: "Mindfulness Basics",
    author: "Serenity Team",
    description: "A gentle introduction to mindfulness, breathwork, and grounding techniques to calm the mind.",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format&fit=crop",
    link: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    tag: "Calmness",
  },
  {
    id: "sleep-hygiene-guide",
    title: "Better Sleep, Better Mood",
    author: "Serenity Team",
    description: "Improve your sleep hygiene with simple, actionable steps that support mental health.",
    cover: "https://images.unsplash.com/photo-1507133750040-4a8f5702155b?w=800&q=80&auto=format&fit=crop",
    link: "https://www.sleepfoundation.org/sleep-hygiene",
    tag: "Sleep",
  },
  {
    id: "food-and-mood",
    title: "Food & Mood",
    author: "Serenity Team",
    description: "Understand how nutrition impacts anxiety, focus, and overall mood with practical meal ideas.",
    cover: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80&auto=format&fit=crop",
    link: "https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626",
    tag: "Nutrition",
  },
];

const EBooks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-serenity-600" />
          <h2 className="text-2xl font-bold">E-Books for Calmness & Mental Health</h2>
        </div>
        <p className="text-muted-foreground mb-6 max-w-3xl">Curated readings to help you relax, build resilience, and understand your mind better. Download or read online.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOOKS.map((b) => (
            <div key={b.id} className="therapeutic-card overflow-hidden flex flex-col">
              <img src={b.cover} alt={b.title} className="h-40 w-full object-cover" />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="text-xs uppercase tracking-wide text-serenity-600">{b.tag}</div>
                <div className="text-lg font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">by {b.author}</div>
                <p className="text-sm text-muted-foreground line-clamp-3">{b.description}</p>
                <div className="mt-auto pt-2">
                  <a href={b.link} target="_blank" rel="noreferrer">
                    <Button className="w-full"><Download className="h-4 w-4 mr-2" /> Read / Download</Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EBooks;


