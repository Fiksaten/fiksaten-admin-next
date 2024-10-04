/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef } from 'react';

type IntersectionObserverHook = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export const useIntersectionObserver = (
  callback: (element: Element) => void,
  options: IntersectionObserverHook = {}
) => {
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [callback, options]);

  return targetRef;
};
