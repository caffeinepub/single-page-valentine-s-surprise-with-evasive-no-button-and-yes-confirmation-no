import { useState } from 'react';
import { useEvasiveNoButton } from './hooks/useEvasiveNoButton';
import { Heart } from 'lucide-react';

export default function App() {
  const [confirmed, setConfirmed] = useState(false);
  const { noButtonRef, noButtonStyle } = useEvasiveNoButton();

  const handleYesClick = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Heart className="absolute top-[10%] left-[15%] w-8 h-8 text-romantic-light opacity-30 animate-float" />
        <Heart className="absolute top-[20%] right-[20%] w-6 h-6 text-romantic-medium opacity-25 animate-float-delayed" />
        <Heart className="absolute bottom-[15%] left-[25%] w-7 h-7 text-romantic-light opacity-20 animate-float-slow" />
        <Heart className="absolute bottom-[25%] right-[15%] w-5 h-5 text-romantic-medium opacity-30 animate-float" />
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-2xl w-full text-center">
        {!confirmed ? (
          <div className="space-y-8">
            {/* Question section */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-romantic-dark tracking-tight leading-tight">
                Will you be my Valentine?
              </h1>
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                You make my heart skip a beat ❤️
              </p>
            </div>

            {/* Buttons section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
              {/* Yes button */}
              <button
                onClick={handleYesClick}
                className="yes-button px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold rounded-full bg-romantic-primary text-white shadow-romantic hover:shadow-romantic-lg hover:scale-105 active:scale-95 transition-all duration-300 min-w-[140px] sm:min-w-[160px]"
              >
                Yes 💕
              </button>

              {/* No button - evasive */}
              <button
                ref={noButtonRef}
                style={noButtonStyle}
                className="no-button px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold rounded-full bg-romantic-subtle text-romantic-medium shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[140px] sm:min-w-[160px]"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="confirmation-message space-y-6 animate-fade-in">
            <div className="inline-block p-6 rounded-full bg-romantic-light/30 mb-4">
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-romantic-primary fill-romantic-primary animate-pulse-gentle" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-romantic-dark">
              Good choice ❤️
            </h2>
            
            {/* 5-line message with simple fade-in */}
            <div className="animate-fade-in-text space-y-2 pt-4">
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                Yay! 😄
              </p>
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                You just made my day saying yes 😉
              </p>
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                I promise to make it worth your while 😏
              </p>
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                I'll try not to be too annoying… maybe 😅
              </p>
              <p className="text-lg sm:text-xl text-romantic-medium font-medium">
                Can't wait to see where this goes!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-romantic-medium/60 px-4">
        <p>
          © {new Date().getFullYear()} · Built with <Heart className="inline w-3 h-3 fill-romantic-primary text-romantic-primary" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-romantic-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
