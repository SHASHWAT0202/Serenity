import { useState } from "react";
import { Heart, Quote, User, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Story = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  image: string;
  author: string;
  role: string;
  tags: string[];
  minutes: number;
};

const stories: Story[] = [
  {
    id: "s1",
    title: "Finding Calm In The Chaos",
    summary:
      "After months of anxiety, Mia found small daily practices that rebuilt her sense of safety.",
    content: [
      "There was a time when mornings felt loud before the world even woke up. My thoughts raced faster than my heartbeat.",
      "I started with two-minute breaths. Not five. Not ten. Just two.",
      "Then I added small rituals: a gentle stretch, a glass of water at the window, one message to a friend.",
      "It wasn’t magic. It was maintenance — and it worked. Calm stopped being a destination and became a practice.",
    ],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    author: "Mia R.",
    role: "Designer & Mindfulness Beginner",
    tags: ["anxiety", "breathwork", "routine"],
    minutes: 3,
  },
  {
    id: "s2",
    title: "The Day I Asked For Help",
    summary:
      "Arjun thought he had to do it all alone — until one honest conversation changed everything.",
    content: [
      "I grew up thinking strength meant silence. I didn’t know that silence could be so heavy.",
      "One afternoon, I told a friend I wasn’t okay. He didn’t fix it. He sat with me. That changed the story.",
      "We booked a consultation together. Having someone in my corner didn’t erase the struggle, but it made the path brighter.",
    ],
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1400&auto=format&fit=crop",
    author: "Arjun P.",
    role: "Grad Student",
    tags: ["seeking help", "community", "courage"],
    minutes: 2,
  },
  {
    id: "s3",
    title: "Tiny Habits, Big Peace",
    summary:
      "Lina reframed progress as small, repeatable steps — the kind that stick even on tough days.",
    content: [
      "I waited years for motivation. It turns out motivation was waiting for me — to start tiny.",
      "One habit at a time: five-minute walk, one page of journaling, lights off before midnight.",
      "Consistency felt boring until it felt like peace. Now, peace feels like home.",
    ],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1400&auto=format&fit=crop",
    author: "Lina V.",
    role: "Teacher",
    tags: ["habits", "sleep", "journaling"],
    minutes: 2,
  },
];

const InspiringStories = () => {
  const [selected, setSelected] = useState<Story | null>(null);

  return (
    <section
      id="inspiring-stories"
      className="py-20 px-4 bg-gradient-to-br from-serenity-50 to-mint-50"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <div className="w-16 h-16 bg-gradient-to-br from-serenity-500 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-3">
            Inspiring Journeys
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Real stories of resilience, recovery, and gentle growth from people
            just like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelected(story)}
              className="text-left rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-serenity-600 text-sm">
                    <User size={16} />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-serenity-600 text-sm">
                    <Clock size={16} />
                    <span>{story.minutes} min</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {story.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-serenity-700">
                  <Quote size={16} />
                  <span className="text-sm font-medium">Read full story</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-serenity-700">
          <div className="inline-flex items-center gap-2">
            <Heart className="text-rose-500" size={16} />
            <span>
              Your story matters. If you’d like to share, we’ll add a submit
              flow soon.
            </span>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selected && (
            <div>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      By {selected.author} • {selected.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {selected.minutes} min read
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {selected.content.map((p, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InspiringStories;


