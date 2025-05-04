import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "./auth.controller";

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.id;
        const { name, address, phoneNumber, bloodGroup, age } = req.body;
        if (!bloodGroup) {
            res.status(400).json({ message: "Blood group is required" });
            return;
        }
        const existingUser = await prisma.user.findFirst({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                address,
                phoneNumber,
                bloodGroup,
                age,
            },
        });
        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                address: updatedUser.address,
                phoneNumber: updatedUser.phoneNumber,
                bloodGroup: updatedUser.bloodGroup,
                age: updatedUser.age,
            },
        });
    } catch (error) {
        console.error("Error during user update:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {  
    try {
        const id = req.user?.id;
        const existingUser = await prisma.user.findFirst({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error during user deletion:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.id;
        const existingUser = await prisma.user.findFirst({
            where: { id },
        });
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                address: existingUser.address,
                phoneNumber: existingUser.phoneNumber,
                bloodGroup: existingUser.bloodGroup,
                age: existingUser.age,
            },
        });
    } catch (error) {
        console.error("Error during user fetch:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
