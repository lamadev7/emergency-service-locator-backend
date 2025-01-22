import express, { Request, Response } from "express";

import { db } from "../config/firebase";
import { calculatePath, calculatePathToService } from "../utils/pathfinding";

const router = express.Router();

// GET /services/all
router.get("/", async (req: Request, res: Response) => {
    try {
        let { type }: any = req.query;

        const snapshot = type == "all" ? await db.ref('/').once("value") : await db.ref('/').orderByChild("type").equalTo(type).once("value");
        let services = snapshot.val();
        services = Object.values(services); // Convert services object to an array of objects

        if (services?.length > 0) services = services?.filter(Boolean);

        if (!services) {
            return res.status(404).json({ error: "No services found" });
        }

        res.status(200).json({ data: services, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/nearest", async (req: Request, res: Response) => {
    const { currentLocation } = req.body;

    if (!currentLocation) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        // Fetch all services from Firebase
        const snapshot = await db.ref("/").once("value");
        const services = snapshot.val();

        // Find the nearest service
        const nearestService: any = calculatePath(currentLocation as string, services);

        if (!nearestService) {
            return res.status(404).json({ error: "No available service found" });
        }

        // Calculate the path to the nearest service
        const path = calculatePathToService(currentLocation, nearestService.location);

        // Construct the response
        const response = {
            nearestService: {
                id: nearestService.id,
                serviceType: nearestService.type === "ambulance" ? "Ambulance" : "Hospital",
                distance: nearestService.distance,
                location: {
                    row: (nearestService.location[0] ?? 0) + 1,
                    col: (nearestService.location[1] ?? 0) + 1,
                },
                status: nearestService.status,
            },
            path, // Path to the nearest service
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /services/status
router.get("/status", async (req: Request, res: Response) => {
    const { serviceId }: any = req.query; // Assuming serviceId is passed as a query parameter

    if (!serviceId) {
        return res.status(400).json({ error: "Missing serviceId parameter" });
    }

    try {
        // Query the database to find the matching record by "id"
        const snapshot = await db.ref("/").orderByChild("id").equalTo(serviceId).once("value");

        if (!snapshot.exists()) {
            return res.status(404).json({ error: "Service not found" });
        }

        let serviceStatus = null;

        // Extract the status field from the matching record
        snapshot.forEach((childSnapshot) => {
            const service = childSnapshot.val();
            serviceStatus = service.status; // Get the "status" field
        });

        res.status(200).json({ status: serviceStatus });
    } catch (error) {
        console.error("Error fetching service status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /services/update
router.post("/update", async (req: Request, res: Response) => {
    const { serviceId, status } = req.body;

    if (!serviceId || !status) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        // Query the database to find the matching record by "id"
        const snapshot = await db.ref("/").orderByChild("id").equalTo(serviceId).once("value");

        if (!snapshot.exists()) {
            return res.status(404).json({ error: "Service not found" });
        }

        let updated = false;

        // Update the matching record's status
        snapshot.forEach((childSnapshot) => {
            childSnapshot.ref.update({ status }); // Update only the "status" field
            updated = true;
        });

        if (updated) {
            res.status(200).json({ message: "Service status updated successfully" });
        } else {
            res.status(500).json({ error: "Failed to update service status" });
        }
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router;
