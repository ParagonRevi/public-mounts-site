// src/utils/imageUtils.js

/**
 * Динамически генерирует правильный URL для изображения из папки assets.
 * Использует специальную конструкцию Vite `new URL(...)` для корректной работы.
 * @param {string | null | undefined} iconName - Имя файла иконки без расширения (например, 'PveMightKill').
 * @returns {string | null} - Готовый к использованию URL или null, если имя не передано или файл не найден.
 */
export const getEventIconUrl = (iconName) => {
    if (!iconName) {
        return null;
    }

    try {
        // Эта конструкция сообщает Vite, что нужно найти ресурс
        // и включить его в сборку. Мы предполагаем, что все иконки имеют расширение .png
        return new URL(`../assets/${iconName}.png`, import.meta.url).href;
    } catch (error) {
        console.error(`Изображение не найдено в src/assets/: ${iconName}.png`, error);
        // Можно вернуть URL для заглушки, если нужно
        // return new URL('../assets/default_icon.png', import.meta.url).href;
        return null;
    }
};
