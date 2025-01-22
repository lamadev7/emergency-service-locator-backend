interface Service {
    id: string;
    location: [number, number];
    type: string;
    status: string;
    distance: number;
}

const heuristic = (a: [number, number], b: [number, number]) => {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

export const calculatePath = (
    userLocation: string,
    services: { [key: string]: Service }
) => {
    const [userRow, userCol]: any = userLocation;
    let nearestService: Service | null = null;
    let shortestDistance = Infinity;

    Object.keys(services).forEach((key) => {
        const service = services[key];

        const [serviceRow, serviceCol] = service.location;
        const distance: any = heuristic([userRow, userCol], [serviceRow, serviceCol]);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestService = {
                id: service.id,
                location: service.location,
                type: service.type,
                status: service.status,
                distance,
            };
        }
    });

    return nearestService;
};

export const calculatePathToService = (currentLocation: string, serviceLocation: [number, number]) => {
    const [userRow, userCol]: any = currentLocation;
    const [serviceRow, serviceCol] = serviceLocation;
    const path: number[][] = [];

    let currentRow = userRow;
    let currentCol = userCol;

    // Calculate horizontal path
    while (currentRow !== serviceRow) {
        path.push([currentRow, currentCol]);
        currentRow += currentRow < serviceRow ? 1 : -1;
    }

    // Calculate vertical path
    while (currentCol !== serviceCol) {
        path.push([currentRow, currentCol]);
        currentCol += currentCol < serviceCol ? 1 : -1;
    }

    // Add the final service cell to the path
    path.push([serviceRow, serviceCol]);

    return path;
};