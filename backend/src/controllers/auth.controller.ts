import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const prisma = new PrismaClient();
export const clientSignUp = async (req: Request, res: Response) => {
    try {
        const { email, name, password, address, phoneNumber } = req.body;

        if(!email || !name || !password || !address || !phoneNumber){
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                address,
                phoneNumber
            }
        });


        // Send a success response
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                address: newUser.address
            }
        });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}
export const orgSignUp = async (req: Request, res: Response) => {
    try {
        const { email, name, password, address, code } = req.body;

        if(!email || !name || !password || !address || !code){
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const existingUser = await prisma.organization.findFirst({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newOrg = await prisma.organization.create({
            data: {
                email,
                name,
                password: hashedPassword,
                address,
                code
            }
        });

        res.status(201).json({ 
            message: 'User created successfully',
            org: {
                id: newOrg.id,
                email: newOrg.email,
                name: newOrg.name,
                address: newOrg.address
            }
        });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}


export const clientLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const user = await prisma.user.findFirst({
            where: { email }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            address: user.address
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true, secure: true});

        // Send a success response
        res.status(200).json({ 
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}
export const orgLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const org = await prisma.organization.findFirst({
            where: { email }
        });
        if (!org) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, org.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const payload = {
            id: org.id,
            email: org.email,
            name: org.name,
            address: org.address
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true, secure: true});

        res.status(200).json({ 
            message: 'Login successful',
            org: {
                id: org.id,
                email: org.email,
                name: org.name,
                address: org.address
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}