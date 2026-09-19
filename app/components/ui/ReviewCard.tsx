import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  rating: number;
  date?: string;
  text: string;
}

export default function ReviewCard({ name, rating, date, text }: ReviewCardProps) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < rating ? '#c5a059' : 'none'}
              color={i < rating ? '#c5a059' : '#e5e5e5'}
            />
          ))}
        </div>
        {date && <span className="review-date">{date}</span>}
      </div>
      <h4 className="reviewer-name">{name}</h4>
      <p className="review-text">&quot;{text}&quot;</p>
    </div>
  );
}
