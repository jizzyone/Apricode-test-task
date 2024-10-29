import { makeAutoObservable } from "mobx";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subtasks: Task[];
}

class TaskStore {
  tasks: Task[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  addTask(title: string, description: string, parentTaskId?: string) {
    const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        subtasks: [],
    };

    if (parentTaskId) {
        const parentTask = this.findTaskById(this.tasks, parentTaskId);
        if (parentTask) {
            parentTask.subtasks.push(newTask);
        }
    } else {
        this.tasks.push(newTask);
    }

    this.saveToLocalStorage();
}

  toggleTaskCompletion(task: Task, completed: boolean) {
    task.completed = completed;
    this.updateSubtasksCompletion(task, completed);
    this.checkParentCompletion(this.tasks, task);
    this.saveToLocalStorage();
  }

  updateSubtasksCompletion(task: Task, completed: boolean) {
    task.subtasks.forEach(subtask => {
      subtask.completed = completed;
      this.updateSubtasksCompletion(subtask, completed);
    });
  }

  checkParentCompletion(tasks: Task[], updatedTask: Task) {
    tasks.forEach(task => {
      const parentTask = this.findParentTask(this.tasks, updatedTask);
    if (parentTask) {
      const allCompleted = parentTask.subtasks.every((subtask) => subtask.completed);
      parentTask.completed = allCompleted;
      this.checkParentCompletion(this.tasks,parentTask);
      }
    });
  }

  findParentTask(tasks: Task[], childTask: Task): Task | undefined {
    for (const task of tasks) {
      if (task.subtasks.includes(childTask)) {
        return task;
      }
      const found = this.findParentTask(task.subtasks, childTask);
      if (found) return found;
    }
    return undefined;
  }

  deleteTask(taskId: string) {
    this.tasks = this.deleteTaskRecursively(this.tasks, taskId);
    this.saveToLocalStorage();
  }

  deleteTaskRecursively(tasks: Task[], taskId: string): Task[] {
    return tasks.filter(task => {
      if (task.subtasks.length) {
        task.subtasks = this.deleteTaskRecursively(task.subtasks, taskId);
      }
      return task.id !== taskId;
    });
  }

  editTask(taskId: string, title: string, description: string) {
    const task = this.findTaskById(this.tasks, taskId);
    if (task) {
      task.title = title;
      task.description = description;
      this.saveToLocalStorage();
    }
  }

  findTaskById(tasks: Task[], taskId: string): Task | undefined {
    for (const task of tasks) {
      if (task.id === taskId) return task;
      const found = this.findTaskById(task.subtasks, taskId);
      if (found) return found;
    }
    return undefined;
  }

  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        this.tasks = JSON.parse(savedTasks);
      } catch (error) {
        console.error("Ошибка загрузки задач из localStorage:", error);
        this.tasks = [];
      }
    }
  }
}

export const taskStore = new TaskStore();
