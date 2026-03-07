export interface Task {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  completed?: boolean;
  completedAt?: number;
}

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// メモリ上にタスクを保持（ページリロードまで維持）
let _tasks: Task[] = [];
let _initialized = false;

export const taskStore = {
  isInitialized: () => _initialized,

  load: (): Task[] => {
    if (_initialized) return _tasks;
    const stored = localStorage.getItem("tasks");
    if (stored) {
      const parsed: Task[] = JSON.parse(stored);
      const now = Date.now();
      _tasks = parsed.filter(
        (t) => !t.completed || !t.completedAt || now - t.completedAt < ONE_WEEK_MS
      );
      if (_tasks.length !== parsed.length) {
        localStorage.setItem("tasks", JSON.stringify(_tasks));
      }
    }
    _initialized = true;
    return _tasks;
  },

  get: () => _tasks,

  // 追加・完了・削除など、localStorageにも即時保存
  set: (tasks: Task[]) => {
    _tasks = tasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },

  // アニメーションなど毎フレームの位置更新はメモリのみ
  updatePositions: (tasks: Task[]) => {
    _tasks = tasks;
  },

  // 定期保存用
  syncToStorage: () => {
    if (_tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(_tasks));
    }
  },
};
