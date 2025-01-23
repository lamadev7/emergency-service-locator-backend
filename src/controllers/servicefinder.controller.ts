import _ from "lodash";
import { Request, Response } from "express";

import { IResponse } from "../types";
import { getStatusCode } from "../utils";
import * as Services from "../services/servicefinder.service";


export const getServices = async (req: Request, res: Response) => {
    try {
        let { type }: any = req.query;

        const result: IResponse = await Services.getServices({ type });

        if (!result?.data?.length) return res.status(404).json({ data: null, error: "No services found" });

        const statusCode = getStatusCode(result?.error);
        res.status(statusCode).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
}

export const getNearestService = async (req: Request, res: Response) => {
    try {
        let { currentLocation }: any = req.query;

        if (currentLocation?.length > 0) currentLocation = _.map(currentLocation, Number);
        if (!currentLocation) return res.status(400).json({ error: "Missing parameters" });

        const result: IResponse = await Services.getNearestService({ currentLocation });

        const statusCode = getStatusCode(result?.error);
        return res.status(statusCode).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
}

export const getServiceStatus = async (req: Request, res: Response) => {
    try {
        const { serviceId }: any = req.query;

        if (!serviceId) return res.status(400).json({ error: "Missing serviceId parameter" });

        const result: IResponse = await Services.getServiceStatus({ serviceId });

        const statusCode = getStatusCode(result?.error);
        return res.status(statusCode).json(result);
    } catch (error) {
        console.error("Error fetching service status:", error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
}

export const updateServiceStatus = async (req: Request, res: Response) => {
    try {
        const { serviceId, status } = req.body;

        if (!serviceId || !status) return res.status(400).json({ data: null, error: "Missing parameters" });

        const result = await Services.updateServiceStatus({ serviceId, status });

        const statusCode = getStatusCode(result?.error);
        res.status(statusCode).json(result);
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
}