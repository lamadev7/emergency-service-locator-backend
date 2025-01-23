export * from "./pathfinding";

export const getStatusCode = (hasError: any) => {
    if (hasError) return 400;
    return 200;
}