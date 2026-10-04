"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface TypingEffectProps {
  text: string;
  speed?: number; // characters per second
  onComplete?: () => void;
  className?: string;
}

export function TypingEffect({ 
  text, 
  speed = 30, 
  onComplete,
  className 
}: TypingEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef(0);

  const typeNextChar = useCallback(() => {
    if (charIndexRef.current < text.length) {
      charIndexRef.current++;
      setDisplayedText(text.slice(0, charIndexRef.current));
      timeoutRef.current = setTimeout(typeNextChar, 1000 / speed);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [text, speed, onComplete]);

  useEffect(() => {
    charIndexRef.current = 0;
    setDisplayedText("");
    setIsComplete(false);

    if (shouldReduceMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    timeoutRef.current = setTimeout(typeNextChar, 1000 / speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, shouldReduceMotion, typeNextChar]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && !shouldReduceMotion && (
        <span className="relative inline-block w-1 h-4 bg-current animate-pulse ml-0.5" aria-hidden="true" />
      )}
    </span>
  );
}

// Enhanced typing effect with word-by-word option
interface TypingEffectWordProps {
  text: string;
  speed?: number; // words per second
  onComplete?: () => void;
  className?: string;
}

export function TypingEffectWord({ 
  text, 
  speed = 5, 
  onComplete,
  className 
}: TypingEffectWordProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wordIndexRef = useRef(0);
  const wordsRef = useRef(text.split(/(\s+)/).filter(w => w.length > 0));

  const typeNextWord = useCallback(() => {
    if (wordIndexRef.current < wordsRef.current.length) {
      wordIndexRef.current++;
      setDisplayedWords(wordsRef.current.slice(0, wordIndexRef.current));
      timeoutRef.current = setTimeout(typeNextWord, 1000 / speed);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [speed, onComplete]);

  useEffect(() => {
    wordsRef.current = text.split(/(\s+)/).filter(w => w.length > 0);
    wordIndexRef.current = 0;
    setDisplayedWords([]);
    setIsComplete(false);

    if (shouldReduceMotion) {
      setDisplayedWords(wordsRef.current);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    timeoutRef.current = setTimeout(typeNextWord, 1000 / speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, shouldReduceMotion, typeNextWord]);

  return (
    <span className={className}>
      {displayedWords.join("")}
      {!isComplete && !shouldReduceMotion && (
        <span className="relative inline-block w-1 h-4 bg-current animate-pulse ml-0.5" aria-hidden="true" />
      )}
    </span>
  );
}

// Streaming typing effect for AI responses (simulates streaming)
interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function StreamingText({ text, speed = 50, className }: StreamingTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let charIndex = 0;

    if (shouldReduceMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    const type = () => {
      if (charIndex < text.length) {
        charIndex++;
        setDisplayedText(text.slice(0, charIndex));
        timeoutRef.current = setTimeout(type, 1000 / speed);
      } else {
        setIsComplete(true);
      }
    };

    timeoutRef.current = setTimeout(type, 50); // Small delay before starting

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, shouldReduceMotion]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && !shouldReduceMotion && (
        <span className="relative inline-block w-1 h-4 bg-current animate-pulse ml-0.5" aria-hidden="true" />
      )}
    </span>
  );
}