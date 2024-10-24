import React, { useState } from "react";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetails";
import { Task, taskStore } from "../store/taskStore"; 
import styles from '../styles/MainView.module.scss';

const MainView: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedSubTask, setSelectedSubTask] = useState<Task | null>(null);

    const handleSelectTask = (task: Task | null) => {
        setSelectedTask(task);
        setSelectedSubTask(null);  // Сбрасываем подзадачу при выборе новой задачи
        if (task) {
            console.log('Selected task: ', task.title, task.description);
        }
    };

    const handleSelectSubTask = (subtask: Task | null) => {
        setSelectedSubTask(subtask);
        if (subtask) {
            console.log('Selected subtask: ', subtask.title, subtask.description);
        }
    };
    
    return (
        <div className={styles.mainContainer}>
            <TaskList tasks={taskStore.tasks} onSelectTask={handleSelectTask} onSelectSubTask={handleSelectSubTask} />
            <TaskDetails task={selectedTask} subtask={selectedSubTask} /> {/* Передаем задачу и подзадачу */}
        </div>
    );
};

export default MainView;
