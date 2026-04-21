import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * SPEED_INCREMENT);
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isGameOver, isPaused, moveSnake, score]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[400px] justify-between items-end glass p-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Score</span>
          <span className="text-3xl font-display font-bold text-neon-cyan neon-text-cyan">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-zinc-500">
            <Trophy size={14} />
            <span className="text-[10px] uppercase tracking-widest font-mono">Best</span>
          </div>
          <span className="text-xl font-display font-medium text-neon-pink neon-text-pink">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative glass p-1 rounded-2xl shadow-2xl">
        <div 
          className="grid gap-px bg-zinc-900/50 rounded-xl overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 400px)',
            aspectRatio: '1/1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className="relative flex items-center justify-center bg-zinc-950/20"
              >
                {isSnakeHead && (
                  <motion.div 
                    layoutId="snake-head"
                    className="w-full h-full bg-neon-cyan neon-shadow-cyan rounded-sm z-20"
                  />
                )}
                {isSnakeBody && (
                  <div className="w-full h-full bg-neon-cyan/50 rounded-sm z-10" />
                )}
                {isFood && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2/3 h-2/3 bg-neon-pink neon-shadow-pink rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-2xl z-50 p-8 text-center"
            >
              <div>
                {isGameOver ? (
                  <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold text-white mb-2">SYSTEM FAILURE</h2>
                    <p className="text-zinc-400 font-mono text-sm uppercase tracking-tighter">The grid has been compromised.</p>
                    <button 
                      onClick={resetGame}
                      className="group relative flex items-center gap-2 mx-auto px-6 py-3 bg-neon-cyan text-zinc-950 font-bold rounded-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                      REBOOT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold text-white mb-2">PAUSED</h2>
                    <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Press SPACE to continue</p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="px-8 py-3 glass hover:bg-white/10 text-white font-bold rounded-lg transition-colors"
                    >
                      RESUME
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
        <div className="px-2 py-1 glass rounded">Arrows to Move</div>
        <div className="px-2 py-1 glass rounded">Space to Pause</div>
      </div>
    </div>
  );
}
