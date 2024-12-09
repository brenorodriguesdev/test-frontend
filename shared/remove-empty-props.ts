export const removeEmptyProps = (obj: Record<string, any>) => {
    Object.keys(obj).forEach(key => {
        if (!obj[key]) {
            delete (obj as any)[key];
        }
    });
    return obj
}