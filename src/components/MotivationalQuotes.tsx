import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type QuoteItem = {
  text: string;
  author?: string;
  tag: string;
};


  
  const QUOTES: QuoteItem[] = [
    { text: "One small step today is a giant leap for your future self.", author: "", tag: "progress" },
    { text: "You have survived 100% of your hardest days.", author: "", tag: "resilience" },
    { text: "Rest is productive. Recharge is repair.", author: "", tag: "rest" },
    { text: "Feelings are visitors. Let them teach you, not define you.", author: "", tag: "mindfulness" },
    { text: "Tiny habits build unshakable peace.", author: "", tag: "habits" },
    { text: "Asking for help is an act of courage.", author: "", tag: "support" },
    { text: "Breathe. Then begin again.", author: "", tag: "breath" },
    { text: "Healing is not linear, but every step is progress.", author: "", tag: "healing" },
    { text: "You are not a burden. You are a human being with needs.", author: "", tag: "self-worth" },
    { text: "Peace begins with a deep breath.", author: "", tag: "calm" },
    { text: "You are doing the best you can with what you have.", author: "", tag: "self-compassion" },
    { text: "Progress, not perfection.", author: "", tag: "progress" },
    { text: "It’s okay to outgrow people, places, and mindsets.", author: "", tag: "growth" },
    { text: "The strongest people are those who ask for help.", author: "", tag: "support" },
    { text: "Slow progress is still progress.", author: "", tag: "patience" },
    { text: "Self-care is not selfish. It’s survival.", author: "", tag: "self-care" },
    { text: "The present moment is enough.", author: "", tag: "mindfulness" },
    { text: "Growth often feels like breaking first.", author: "", tag: "growth" },
    { text: "You are allowed to rest. You are allowed to just be.", author: "", tag: "rest" },
    { text: "Even on hard days, your presence matters.", author: "", tag: "hope" },
    { text: "You are not behind. You’re on your own path.", author: "", tag: "comparison" },
    { text: "Sometimes just surviving is a huge win.", author: "", tag: "survival" },
    { text: "Self-kindness is a quiet revolution.", author: "", tag: "self-compassion" },
    { text: "Let go of what you cannot control.", author: "", tag: "acceptance" },
    { text: "You don’t have to figure it all out today.", author: "", tag: "pressure" },
    { text: "You deserve peace. Even now.", author: "", tag: "peace" },
    { text: "Not every storm comes to disrupt your life; some clear your path.", author: "", tag: "perspective" },
    { text: "Healing happens in silence, slowness, and softness.", author: "", tag: "healing" },
    { text: "Your worth isn’t measured by your productivity.", author: "", tag: "self-worth" },
    { text: "Allow yourself to feel without judgment.", author: "", tag: "emotions" },
    { text: "You are more than your worst thoughts.", author: "", tag: "identity" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", tag: "motivation" },
    { text: "When you rest, you grow.", author: "", tag: "rest" },
    { text: "You are not your anxiety.", author: "", tag: "mental-health" },
    { text: "The fact that you’re trying means everything.", author: "", tag: "effort" },
    { text: "Let yourself be proud of small victories.", author: "", tag: "growth" },
    { text: "Take it one breath at a time.", author: "", tag: "mindfulness" },
    { text: "Recovery is messy, and that’s okay.", author: "", tag: "healing" },
    { text: "You can be a masterpiece and a work in progress at the same time.", author: "", tag: "growth" },
    { text: "It’s okay to pause. It’s okay to not be okay.", author: "", tag: "mental-health" },
    { text: "Talk to yourself the way you’d talk to someone you love.", author: "", tag: "self-talk" },
    { text: "Emotions are information, not instructions.", author: "", tag: "emotional-intelligence" },
    { text: "The night is darkest before the dawn.", author: "", tag: "hope" },
    { text: "Celebrate the small things. They build the big ones.", author: "", tag: "gratitude" },
    { text: "You deserve joy without earning it.", author: "", tag: "joy" },
    { text: "Self-awareness is the beginning of change.", author: "", tag: "growth" },
    { text: "Allow yourself to be human.", author: "", tag: "acceptance" },
    { text: "Worrying means you suffer twice.", author: "Newt Scamander", tag: "anxiety" },
    { text: "You’re not too much. You’re enough.", author: "", tag: "self-worth" },
    { text: "You don’t have to carry it all alone.", author: "", tag: "support" },
    { text: "Healing takes time. Give yourself grace.", author: "", tag: "healing" },
    { text: "Choose progress over pressure.", author: "", tag: "balance" },
    { text: "Nothing blooms year-round. Neither do you.", author: "", tag: "rest" },
    { text: "You are doing better than you think.", author: "", tag: "self-esteem" },
    { text: "Your emotions are valid. Always.", author: "", tag: "emotions" },
    { text: "Peace is found in acceptance, not control.", author: "", tag: "peace" },
    { text: "Every breath is a new beginning.", author: "", tag: "breath" },
    { text: "It’s okay to feel broken. That’s where the light gets in.", author: "Rumi", tag: "healing" },
    { text: "There is no shame in healing at your own pace.", author: "", tag: "self-compassion" }
  ];
  

function useInterval(callback: () => void, delayMs: number | null) {
  useEffect(() => {
    if (delayMs === null) return;
    const id = setInterval(callback, delayMs);
    return () => clearInterval(id);
  }, [callback, delayMs]);
}

const MotivationalQuotes = () => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [api, setApi] = useState<CarouselApi | null>(null);

  useInterval(() => {
    if (autoPlay) api?.scrollNext();
  }, 5000);

  return (
    <section id="motivational-quotes" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-lavender-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-3">Motivational Boost</h2>
          <p className="text-gray-700 max-w-xl mx-auto">Short, science-informed reminders to refresh your mind and reset your focus.</p>
        </div>

        <div className="therapeutic-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-serenity-700">
              <Timer size={18} />
              <span className="text-sm">Auto-play {autoPlay ? "on" : "off"} • 5s</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setAutoPlay((v) => !v)}>
                {autoPlay ? "Pause" : "Play"}
              </Button>
              <Button variant="default" onClick={() => api?.scrollNext()}>
                <RefreshCw size={16} className="mr-2" /> Next
              </Button>
            </div>
          </div>

          <Carousel className="relative" setApi={setApi}>
            <CarouselContent>
              {QUOTES.map((q, i) => (
                <CarouselItem key={i} className="basis-full">
                  <div className="min-h-[160px] flex items-center justify-center text-center px-4">
                    <div className="max-w-2xl">
                      <div className="text-5xl mb-4">✨</div>
                      <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800">
                        “{q.text}”
                      </blockquote>
                      {q.author && (
                        <div className="mt-2 text-sm text-gray-600">— {q.author}</div>
                      )}
                      <div className="mt-4 inline-block text-xs text-gray-600 bg-white/70 px-3 py-1 rounded-full border">
                        #{q.tag}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default MotivationalQuotes;


