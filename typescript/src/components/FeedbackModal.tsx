"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal component for collecting user feedback
 * Includes rating, category selection, feedback text, and optional email
 */
export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would send the feedback to a server
    console.log({
      rating,
      category,
      feedback,
      email
    });
    
    setSubmitting(false);
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setRating(null);
      setCategory('');
      setFeedback('');
      setEmail('');
      setSubmitted(false);
      onOpenChange(false);
    }, 3000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">How would you rate your experience?</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating && star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    aria-label={`Rate ${star} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">Feedback Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              >
                <option value="">Select a category</option>
                <option value="ui">User Interface</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Feedback */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="block text-sm font-medium">Your Feedback</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                placeholder="What do you like? What could be improved?"
                required
              />
            </div>
            
            {/* Email (optional) */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email (optional)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="For follow-up questions"
              />
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md disabled:opacity-50 transition-colors duration-200"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h3 className="text-xl font-semibold">Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}