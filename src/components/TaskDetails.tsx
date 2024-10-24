import React, { useEffect, useState } from "react";
import styles from '../styles/TaskDetails.module.scss'; 
import { Task } from "../store/taskStore";
import { taskStore } from "../store/taskStore";

interface TaskDetailsProps {
    task: Task | null;
    subtask: Task | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, subtask }) => {
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState('');
    const [editedTitle, setEditedTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        if (task) {
            setEditedTitle(task.title || '');
            setEditedDesc(task.description || '');
        }
    }, [task]);

    if (subtask) {
        return (
            <div>
                <h2>{subtask.title}</h2>
                <p>{subtask.description}</p>
            </div>
        );
    }

    if (!task) {
        return <div className={styles.taskDetails}>Выберите задачу для просмотра</div>;
    }

    const handleEditTitle = () => {
        if (task) {
            taskStore.editTask(task.id, editedTitle, task.description); // Обновляем заголовок
            setIsEditingTitle(false);
        }
    };

    const handleEditDescription = () => {
        if (task) {
            taskStore.editTask(task.id, task.title, editedDesc);
            setIsEditingDesc(false);
        }
    };

    return (
        <div className={styles.taskDetails}>
            <h1 className={styles.title}>Подробности задачи</h1>
            <div className={styles.taskTitle}>
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleEditTitle}
                        className={styles.editInput}
                    />
                ) : (
                    <span onDoubleClick={() => setIsEditingTitle(true)}>
                        {task.title}
                    </span>
                )}
            </div>
            <div className={styles.taskDescription}>
                {isEditingDesc ? (
                    <textarea
                        value={editedDesc}
                        onChange={e => setEditedDesc(e.target.value)}
                        onBlur={handleEditDescription}
                        className={styles.editTextarea}
                    />
                ) : (
                    <div onDoubleClick={() => setIsEditingDesc(true)}>
                        {task.description || 'Нет описания'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;