import React from 'react';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../store/themeStore';
import styles from '../styles/ThemeToggle.module.scss';

const ThemeToggle: React.FC = observer(() => {
    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        themeStore.setTheme(event.target.value as 'light' | 'dark' | 'system');
    };

    return (
        <div className={styles.themeToggle}>
            <select 
                value={themeStore.theme}
                onChange={handleThemeChange}
                className={styles.themeSelect}
            >
                <option value="light">Светлая тема</option>
                <option value="dark">Темная тема</option>
                <option value="system">Системная тема</option>
            </select>
        </div>
    );
});

export default ThemeToggle;