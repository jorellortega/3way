import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({
  rating,
  totalStars = 5,
  className,
  starClassName,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: totalStars }).map((_, i) => {
        const starNumber = i + 1;
        if (starNumber <= rating) {
          return (
            <Star
              key={i}
              className={cn("h-5 w-5 fill-yellow-400 text-yellow-400", starClassName)}
            />
          );
        } else if (starNumber > rating && starNumber - 1 < rating) {
          const percentage = (rating - i) * 100;
          return (
            <div key={i} className="relative">
              <Star
                className={cn("h-5 w-5 fill-gray-700 stroke-gray-600", starClassName)}
              />
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${percentage}%` }}
              >
                <Star
                  className={cn(
                    "h-5 w-5 fill-yellow-400 text-yellow-400",
                    starClassName
                  )}
                />
              </div>
            </div>
          );
        } else {
          return (
            <Star
              key={i}
              className={cn("h-5 w-5 fill-gray-700 stroke-gray-600", starClassName)}
            />
          );
        }
      })}
    </div>
  );
} 