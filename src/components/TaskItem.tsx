import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { taskStore } from "../store/taskStore";
import styles from '../styles/TaskItem.module.scss';
import { Task } from "../store/taskStore";


interface TaskItemProps {
  task: Task;
  level?: number; // Добавляем уровень для отступа подзадач
  onSelectTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = observer(({ task, level = 0, onSelectTask}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [showSubTaskInput, setShowSubTaskInput] = useState(false);
  const [newSubTaskDesc, setNewSubTaskDesc] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title); 

  const handleCheckboxChange = () => {
    taskStore.toggleTaskCompletion(task, !task.completed);
  };

  const handleEditTitle = () => {
    taskStore.editTask(task.id, editedTitle, task.description); 
    setIsEditing(false); 
  };


  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      taskStore.deleteTask(task.id);
    }
  };

  const handleTaskClick = () => {
    onSelectTask(task);
  };

  const toggleExpand = () => setIsExpanded(prev => !prev);

  const addSubTask = () => {
    if (newSubTaskTitle.trim()) {
      taskStore.addTask(newSubTaskTitle, newSubTaskDesc, task.id); // Добавляем также описание
      setNewSubTaskTitle('');
      setNewSubTaskDesc('');
      setShowSubTaskInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditTitle();
    }
  };

  return (
    <div className={styles.taskItem} style={{ paddingLeft: `${level * 20}px` }}> {/* Отступ для уровня */}
      <div className={styles.taskItemContainer}>
        <div className={styles.taskTitle}>
          {task.subtasks.length > 0 && (
            <span className={styles.expandIcon} onClick={toggleExpand}>
               {isExpanded ? "▼" : "▶"}  { /*символ раскрытия */}
            </span>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleEditTitle}
              onKeyDown={handleKeyDown}
              autoFocus
              className={styles.editInput}
            />
          ) : (
            <span onClick={handleTaskClick}onDoubleClick={() => setIsEditing(true)}>{task.title}</span> // Двойной клик для редактирования
          )}
        </div>
        <div className={styles.taskControls}>
        <button onClick={() => setShowSubTaskInput(!showSubTaskInput)}>
        {showSubTaskInput ? "Отмена" : "+"}
        </button>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={task.completed}
            onChange={handleCheckboxChange}
          />
          <button onClick={handleDelete}>Удалить</button>
        </div>
      </div>
      
      {/* добавление подзадачи, если выполнено условие */}
      {showSubTaskInput && (
        <div className={styles.newSubTaskForm}>
          <input
            type="text"
            value={newSubTaskTitle}
            onChange={e => setNewSubTaskTitle(e.target.value)}
            placeholder="Новая подзадача"
          />
          <input
          type="text"
          value={newSubTaskDesc}
          onChange={e => setNewSubTaskDesc(e.target.value)}
          placeholder="Описание к подзадаче"
          />
          <button onClick={addSubTask}>Добавить подзадачу</button>
        </div>
      )}
      {isExpanded && (
        <div>
          {/* просмотр подзадач */}
          {task.subtasks.map(subtask => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              level={level + 1}
              onSelectTask={onSelectTask} // Передаем onSelectTask для подзадач
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default TaskItem;
