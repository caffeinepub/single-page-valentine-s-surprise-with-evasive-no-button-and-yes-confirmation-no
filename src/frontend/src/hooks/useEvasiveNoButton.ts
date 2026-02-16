import { useRef, useEffect, useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useEvasiveNoButton() {
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isEvading, setIsEvading] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);

  const getViewportBounds = useCallback(() => {
    const padding = 20; // Keep button away from edges
    const buttonWidth = 160;
    const buttonHeight = 60;
    
    return {
      minX: padding,
      maxX: window.innerWidth - buttonWidth - padding,
      minY: padding,
      maxY: window.innerHeight - buttonHeight - padding,
    };
  }, []);

  const getRandomPosition = useCallback((currentX: number, currentY: number): Position => {
    const bounds = getViewportBounds();
    const minDistance = 150; // Minimum distance to move
    
    let newX: number;
    let newY: number;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
      newY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
      attempts++;
    } while (
      attempts < maxAttempts &&
      Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2)) < minDistance
    );

    return { x: newX, y: newY };
  }, [getViewportBounds]);

  const handleProximity = useCallback((clientX: number, clientY: number) => {
    if (!noButtonRef.current || isEvading) return;

    const now = Date.now();
    if (now - lastMoveTimeRef.current < 300) return; // Throttle movements

    const rect = noButtonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(clientX - buttonCenterX, 2) + Math.pow(clientY - buttonCenterY, 2)
    );

    const proximityThreshold = 100; // Distance at which button starts evading

    if (distance < proximityThreshold) {
      setIsEvading(true);
      lastMoveTimeRef.current = now;

      const currentX = position.x || rect.left;
      const currentY = position.y || rect.top;
      const newPosition = getRandomPosition(currentX, currentY);
      
      setPosition(newPosition);

      // Reset evading state after animation
      setTimeout(() => setIsEvading(false), 400);
    }
  }, [position, isEvading, getRandomPosition]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      handleProximity(e.clientX, e.clientY);
    });
  }, [handleProximity]);

  // Touch move handler
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        handleProximity(touch.clientX, touch.clientY);
      });
    }
  }, [handleProximity]);

  // Touch start handler for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleProximity(touch.clientX, touch.clientY);
    }
  }, [handleProximity]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleTouchMove, handleTouchStart]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (position.x !== 0 || position.y !== 0) {
        const bounds = getViewportBounds();
        setPosition(prev => ({
          x: Math.min(Math.max(prev.x, bounds.minX), bounds.maxX),
          y: Math.min(Math.max(prev.y, bounds.minY), bounds.maxY),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, getViewportBounds]);

  const noButtonStyle: React.CSSProperties = position.x !== 0 || position.y !== 0
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    : {};

  return {
    noButtonRef,
    noButtonStyle,
  };
}
