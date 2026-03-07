import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFD93D", "#95E1D3",
  "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA",
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newText, setNewText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

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
  };

  const completeTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: true } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-6 py-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white flex-1">タスク一覧</h1>
        <span className="text-sm text-white/50">{tasks.filter((t) => !t.completed).length} 件</span>
      </div>

      {/* タスク追加欄 */}
      <form onSubmit={addTask} className="flex gap-2 px-6 pb-4">
        <Input
          type="text"
          placeholder="新しいタスクを入力..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-purple-400"
        />
        <Button
          type="submit"
          disabled={!newText.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* 未完了リスト */}
      <div className="px-6 pb-4 space-y-3">
        {tasks.filter((t) => !t.completed).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-white/50">
            <div className="text-4xl">🌌</div>
            <p>タスクがありません</p>
          </div>
        ) : (
          tasks.filter((t) => !t.completed).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 backdrop-blur-sm"
              style={{ backgroundColor: task.color + "33" }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: task.color }} />
              <p className="text-white flex-1 break-words">{task.text}</p>
              <button
                onClick={() => completeTask(task.id)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Check className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 完了リスト */}
      {tasks.filter((t) => t.completed).length > 0 && (
        <div className="px-6 pb-8">
          <p className="text-white/40 text-sm font-medium mb-3">完了済み</p>
          <div className="space-y-2">
            {tasks.filter((t) => t.completed).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/5 opacity-50"
                style={{ backgroundColor: task.color + "1A" }}
              >
                <Check className="h-3.5 w-3.5 text-white/60 flex-shrink-0" />
                <p className="text-white/60 flex-1 break-words line-through text-sm">{task.text}</p>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
