import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Task } from "../store/taskStore"
import { taskStore } from "../store/taskStore";
import styles from '../styles/TaskList.module.scss';
import TaskItem from './TaskItem'

interface TaskListProps {
    onSelectTask: (task: Task | null) => void;
    onSelectSubTask: (subtask: Task | null) => void;
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = observer(({ onSelectTask, onSelectSubTask, tasks }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newSubTask, setNewSubTask] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handleTaskClick = (task: Task) => {
        onSelectTask(task);
    };

    const addTask = () => {
        if (newTaskTitle.trim()) {
            taskStore.addTask(newTaskTitle, newSubTask);
            setNewTaskTitle('');
            setNewSubTask('');
            setIsAddingTask(false);
        }
    };

    return (
        <div className={styles.taskList}>
            <h1 className={styles.title}>Список задач</h1>
            <div className={styles.addTaskSection}>
                <button 
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className={styles.addTaskButton}
                >
                    {isAddingTask ? "Отменить" : "Добавить задачу"}
                </button>

                {isAddingTask && (
                    <div className={styles.newTaskForm}>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Новая задача"
                            className={styles.taskInput}
                        />
                        <input
                            type="text"
                            value={newSubTask}
                            onChange={e => setNewSubTask(e.target.value)}
                            placeholder="Описание задачи"
                            className={styles.taskInput}
                        />
                        <button 
                            onClick={addTask}
                            className={styles.addButton}
                        >
                            Добавить
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.tasksContainer}>
                {taskStore.tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onSelectTask={handleTaskClick}
                    />
                ))}
            </div>
        </div>
    );
});

export default TaskList;
