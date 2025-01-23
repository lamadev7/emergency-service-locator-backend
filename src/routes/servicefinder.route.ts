import _ from "lodash";
import express from "express";
import { getServices, getNearestService, getServiceStatus, updateServiceStatus } from "../controllers/servicefinder.controller";

const router = express.Router();

router.get("/", getServices);
router.get("/nearest", getNearestService);
router.get("/status", getServiceStatus);
router.post("/update", updateServiceStatus);

export default router;
