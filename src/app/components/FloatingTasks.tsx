import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { Check, Menu, X, List, Plus, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

interface Task {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  completed?: boolean;
}

interface Burst {
  id: string;
  x: number;
  y: number;
  color: string;
  particles: Array<{ id: number; angle: number; distance: number; size: number }>;
}

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFD93D", "#95E1D3",
  "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA",
];

export function FloatingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
      size: Math.random() < 0.7 ? 1 : Math.random() < 0.85 ? 2 : 3,
      opacity: 0.3 + Math.random() * 0.7,
    })), []);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const draggingIdRef = useRef<string | null>(null);
  const dragPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragVelRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const prevDragPosRef = useRef<{ x: number; y: number } | null>(null);


  // タスクを読み込む
  useEffect(() => {
    const loadTasks = () => {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    };
    
    loadTasks();
    // 画面に戻ってきた時に再読み込み
    window.addEventListener("focus", loadTasks);
    
    return () => {
      window.removeEventListener("focus", loadTasks);
    };
  }, []);

  // ドラッグ処理
  useEffect(() => {
    const updateDragPos = (clientX: number, clientY: number) => {
      if (!draggingIdRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      if (prevDragPosRef.current) {
        dragVelRef.current = {
          vx: Math.max(-1.5, Math.min(1.5, (x - prevDragPosRef.current.x) * 0.4)),
          vy: Math.max(-1.5, Math.min(1.5, (y - prevDragPosRef.current.y) * 0.4)),
        };
      }
      prevDragPosRef.current = { x, y };
      dragPosRef.current = { x, y };
    };

    const endDrag = () => {
      draggingIdRef.current = null;
      dragPosRef.current = null;
      prevDragPosRef.current = null;
      setDraggingId(null);
    };

    const handleMouseMove = (e: MouseEvent) => updateDragPos(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!draggingIdRef.current) return;
      e.preventDefault();
      updateDragPos(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", endDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, []);

  const startDrag = (clientX: number, clientY: number, taskId: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    draggingIdRef.current = taskId;
    dragPosRef.current = { x, y };
    prevDragPosRef.current = { x, y };
    dragVelRef.current = { vx: 0, vy: 0 };
    setDraggingId(taskId);
  };

  const handleMouseDown = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY, taskId);
  };

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    e.preventDefault();
    startDrag(e.touches[0].clientX, e.touches[0].clientY, taskId);
  };

  // タスクを追加
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newText.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setNewText("");
    setAddModalOpen(false);
  };

  // タスクを完了
  const completeTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const burst: Burst = {
        id: Date.now().toString(),
        x: task.x,
        y: task.y,
        color: task.color,
        particles: Array.from({ length: 14 }, (_, i) => ({
          id: i,
          angle: (i / 14) * 360 + Math.random() * 20 - 10,
          distance: 60 + Math.random() * 60,
          size: Math.random() < 0.5 ? 4 : Math.random() < 0.8 ? 6 : 8,
        })),
      };
      setBursts((prev) => [...prev, burst]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burst.id));
      }, 1000);
    }
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: true } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // アニメーションループ
  useEffect(() => {
    if (tasks.length === 0) return;

    const animate = () => {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          // ドラッグ中はカーソル座標を使う
          if (task.id === draggingIdRef.current && dragPosRef.current) {
            return {
              ...task,
              x: dragPosRef.current.x,
              y: dragPosRef.current.y,
              vx: dragVelRef.current.vx,
              vy: dragVelRef.current.vy,
            };
          }

          let newX = task.x + task.vx;
          let newY = task.y + task.vy;
          let newVx = task.vx;
          let newVy = task.vy;

          // 画面端で反射
          if (newX <= 5 || newX >= 95) {
            newVx = -task.vx;
            newX = newX <= 5 ? 5 : 95;
          }
          if (newY <= 5 || newY >= 95) {
            newVy = -task.vy;
            newY = newY <= 5 ? 5 : 95;
          }

          return {
            ...task,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tasks.length]);

  // 定期的にlocalStorageを更新
  useEffect(() => {
    const interval = setInterval(() => {
      if (tasks.length > 0) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }, 5000); // 5秒ごと

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#03000f] relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a001a] via-[#03000f] to-[#000510]" />

      {/* 星雲（ネビュラ）効果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="nebula-1 absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", top: "-10%", left: "-10%" }} />
        <div className="nebula-2 absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(circle, #1d4ed8, transparent 70%)", bottom: "10%", right: "-5%" }} />
        <div className="nebula-3 absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[60px]"
          style={{ background: "radial-gradient(circle, #be185d, transparent 70%)", top: "40%", left: "30%" }} />
      </div>

      {/* 星 */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              backgroundColor: star.size === 3 ? "#ffe9a0" : "#ffffff",
              boxShadow: star.size === 3 ? `0 0 ${star.size * 3}px #ffe9a0` : "none",
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* タスクコンテナ */}
      <div ref={containerRef} className="relative w-full h-screen">
        {tasks.filter((t) => !t.completed).map((task) => (
          <motion.div
            key={task.id}
            className="absolute group"
            style={{
              left: `${task.x}%`,
              top: `${task.y}%`,
              cursor: draggingId === task.id ? "grabbing" : "grab",
              zIndex: draggingId === task.id ? 50 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, task.id)}
            onTouchStart={(e) => handleTouchStart(e, task.id)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="relative flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 min-w-[150px] max-w-[280px] select-none"
              style={{
                backgroundColor: task.color + "E6",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p className="text-white font-medium text-center break-words flex-1">
                {task.text}
              </p>

              {/* 完了ボタン */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={() => completeTask(task.id)}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 hover:bg-green-400 flex items-center justify-center transition-colors"
              >
                <Check className="h-3.5 w-3.5 text-white" />
              </button>

              {/* グロー効果 */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl -z-10 opacity-50"
                style={{ backgroundColor: task.color }}
              />
            </div>
          </motion.div>
        ))}

        {/* バースト（星が弾ける演出） */}
        {bursts.map((burst) =>
          burst.particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            return (
              <motion.div
                key={`${burst.id}-${p.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${burst.x}%`,
                  top: `${burst.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.id % 3 === 0 ? "#ffffff" : burst.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.id % 3 === 0 ? "#ffffff" : burst.color}`,
                  translateX: "-50%",
                  translateY: "-50%",
                  zIndex: 100,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })
        )}
      </div>

      {/* 空の状態 */}
      {tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/70 space-y-4">
            <div className="text-6xl">🌌</div>
            <p className="text-xl">タスクがありません</p>
            <p className="text-sm">タスクを追加して始めましょう</p>
          </div>
        </div>
      )}

      {/* ハンバーガーメニュー */}
      <div className="fixed top-8 left-8 z-50">
        <Button
          onClick={() => setMenuOpen((prev) => !prev)}
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
        >
          {menuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </Button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 left-0 min-w-[180px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => { navigate("/list"); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-white hover:bg-white/20 transition-colors text-left"
              >
                <List className="h-4 w-4" />
                タスク
              </button>
              <button
                onClick={() => { setAboutOpen(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-white hover:bg-white/20 transition-colors text-left"
              >
                <Info className="h-4 w-4" />
                このアプリについて
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* タスク数表示 */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
        <p className="text-white font-medium">
          {tasks.filter((t) => !t.completed).length} 個のタスク
        </p>
      </div>

      {/* 追加ボタン */}
      <div className="fixed top-8 right-8 z-50">
        <Button
          onClick={() => setAddModalOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
        >
          <Plus className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* タスク追加モーダル */}
      <AnimatePresence>
        {addModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 z-50"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-white font-bold text-lg mb-4">タスクを追加</h2>
                <form onSubmit={addTask} className="space-y-3">
                  <input
                    type="text"
                    placeholder="タスクを入力..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={!newText.trim()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium disabled:opacity-40 transition-colors"
                    >
                      追加
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* このアプリについてモーダル */}
      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setAboutOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-6 z-50"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">Todospace とは</h2>
                  <button onClick={() => setAboutOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  優先度は低いけれど、いつかはやっておきたいこと——そんなタスクを宇宙空間に漂わせておくアプリです。
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  忘れてしまいそうなことを宇宙へ放り出しておけば、ふとした瞬間に目に入って思い出せます。急がなくていい、でも忘れたくないタスクを書いて、宇宙へ漂流させましょう。
                </p>
                <button
                  onClick={() => setAboutOpen(false)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
