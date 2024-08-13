/* Stores a key-value pair in session storage */
export const storeInSession = (key: string, value: string): void => {
    return sessionStorage.setItem(key, value);
}

/* Retrieves a value from session storage by its key */
export const lookInSession = (key: string): string | null => {
    return sessionStorage.getItem(key);
}

/* Removes a key-value pair from session storage by its key */
export const removeFromSession = (key: string): void => {
    return sessionStorage.removeItem(key);
}

/* Clears all items from session storage */
export const clearSession = (): void => {
    sessionStorage.clear();
}