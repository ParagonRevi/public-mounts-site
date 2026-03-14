import { supabase } from "../lib/supabase";
import { MYTHIC_MOUNTS_NAMES } from "../config/constants";

let cache = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/**
 * Получает список мифических маунтов с кэшированием
 * @returns {Promise<Array>} Массив данных маунтов
 */
export async function getMythicMounts() {
    const now = Date.now();

    // Возвращаем из кэша, если он ещё актуален
    if (cache && (now - lastFetchTime) < CACHE_TTL) {
        return cache;
    }

    try {
        const { data, error } = await supabase
            .from("gds_mounts")
            .select("mount_id, data, advance_data")
            .not("advance_data", "is", null);

        if (error) throw error;

        const sortedData = data
            ? data.sort((a, b) => a.mount_id - b.mount_id)
            : [];

        cache = sortedData;
        lastFetchTime = now;

        return cache;
    } catch (err) {
        console.error("Failed to fetch mythic mounts:", err);
        throw err;
    }
}

/**
 * Очищает кэш маунтов
 */
export function clearCache() {
    cache = null;
    lastFetchTime = 0;
}

/**
 * Принудительно обновляет кэш
 * @returns {Promise<Array>}
 */
export async function refreshCache() {
    cache = null;
    lastFetchTime = 0;
    return getMythicMounts();
}
