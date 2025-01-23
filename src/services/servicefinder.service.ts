import { db } from "../config/firebase";
import { INearestServiceProps, IResponse } from "../types";
import { calculatePath, calculatePathToService } from "../utils/index";


export const getServices = async ({ type }: { type: string }): Promise<IResponse> => {
    try {
        const snapshot = type == "all" ? await db.ref('/').once("value") : await db.ref('/').orderByChild("type").equalTo(type).once("value");
        let services = snapshot.val();
        services = Object.values(services);

        if (services?.length > 0) services = services?.filter(Boolean);

        return {
            data: services,
            error: null,
        }
    } catch (error) {
        console.error(error);
        return {
            error: error,
            data: null
        }
    }
}

export const getNearestService = async ({ currentLocation }: INearestServiceProps): Promise<IResponse> => {
    try {
        const snapshot = await db.ref("/").once("value");
        const services = snapshot.val();

        // Find the nearest service
        const nearestService: any = calculatePath(currentLocation, services);

        if (!nearestService) return { data: null, error: "No available service found" };

        // Calculate the path to the nearest service
        const path = calculatePathToService(currentLocation, nearestService.location);

        // Construct the response
        const response = {
            nearestService: {
                id: nearestService.id,
                serviceType: /ambulance/i.test(nearestService.type) ? "Ambulance" : "Hospital",
                distance: nearestService.distance,
                location: {
                    row: (nearestService.location[0] ?? 0) + 1,
                    col: (nearestService.location[1] ?? 0) + 1,
                },
                status: nearestService.status,
            },
            path, // Path to the nearest service
        };

        return { data: response, error: null };
    } catch (error) {
        console.error(error);
        return {
            error: error,
            data: null
        }
    }
}

export const getServiceStatus = async ({ serviceId }: { serviceId: string }): Promise<IResponse> => {
    try {
        // Query the database to find the matching record by "id"
        const snapshot = await db.ref("/").orderByChild("id").equalTo(serviceId).once("value");

        if (!snapshot.exists()) return { data: null, error: "Service not found" }

        let serviceStatus = null;

        // Extract the status field from the matching record
        snapshot.forEach((childSnapshot) => {
            const service = childSnapshot.val();
            serviceStatus = service.status; // Get the "status" field
        });

        return { data: serviceStatus, error: null };
    } catch (error) {
        console.error(error);
        return {
            error: error,
            data: null
        }
    }
}

export const updateServiceStatus = async ({ serviceId, status }: { serviceId: string, status: string }) => {
    try {
        // Query the database to find the matching record by "id"
        const snapshot = await db.ref("/").orderByChild("id").equalTo(serviceId).once("value");

        if (!snapshot.exists()) return { data: { isUpdated: false }, error: "Service not found" }

        let updated = false;

        // Update the matching record's status
        snapshot.forEach((childSnapshot) => {
            childSnapshot.ref.update({ status }); // Update only the "status" field
            updated = true;
        });

        return { data: { isUpdated: updated }, error: null }
    } catch (error) {
        console.error(error);
        return {
            error: error,
            data: { isUpdated: false }
        }
    }
}