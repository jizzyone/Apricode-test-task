import { makeAutoObservable } from 'mobx';

type Theme = 'light' | 'dark' | 'system';

class ThemeStore {
    theme: Theme = 'system';

    constructor() {
        makeAutoObservable(this);
        this.initTheme();
    }

    initTheme() {
        // Получаем сохраненную тему из localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            this.theme = savedTheme;
        }
        this.applyTheme(this.theme);
    }

    setTheme(newTheme: Theme) {
        this.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.applyTheme(newTheme);
    }

    private applyTheme(theme: Theme) {
        const root = document.documentElement;
        
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
}

export const themeStore = new ThemeStore();