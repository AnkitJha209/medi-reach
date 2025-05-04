import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "./auth.controller";

export const patientRegistration = async (req: AuthRequest, res: Response) => {
    try {
        const {
            orgId,
            date,
            time,
            name,
            age,
            address,
            phoneNumber,
            bloodGroup,
        } = req.body;
        const userId = req.user?.id;

        if (!userId || !orgId || !date || !time || !status) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const newPatient = await prisma.patient.create({
            data: {
                userId,
                name,
                age,
                address,
                phoneNumber,
                email: req.user?.email,
                bloodGroup,
            },
        });

        res.status(201).json({
            message: "Patient registered successfully",
            patient: {
                id: newPatient.id,
                name: newPatient.name,
                age: newPatient.age,
                address: newPatient.address,
                phoneNumber: newPatient.phoneNumber,
                email: newPatient.email,
                bloodGroup: newPatient.bloodGroup,
            },
        });
    } catch (error) {
        console.error("Patient registration error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const requestAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { orgId, date, time, status, patientId, type } = req.body;
        const userId = req.user?.id;

        if (!userId || !orgId || !date || !time || !status) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const newRequest = await prisma.request.create({
            data: {
                patientId,
                organizationId: orgId,
                userId,
                // date and time should have constraints.
                // and time should be alloted by the organization.
                date,
                status: "PENDING",
                type,
            },
        });

        res.status(201).json({
            message: "Appointment request created successfully",
            request: {
                id: newRequest.id,
                orgId: newRequest.organizationId,
                date: newRequest.date,
                status: newRequest.status,
            },
        });
    } catch (error) {
        console.error("Appointment request error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const getAllPreviousRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const allRequests = await prisma.user.findFirst({
            where: { id: userId },
            include: {
                requests: true
            },
        });

        res.status(200).json({
            message: "Previous requests fetched successfully",
            allRequests: allRequests?.requests,
        });
    } catch (error) {
        console.error("Error fetching previous requests:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}