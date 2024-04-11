import { encryptPassword } from "@/utils/hash";
import prisma from "@/utils/prisma";

interface UserFormData {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
    country: string;
    phoneNumber: string;
    ceaNumber: string | null;
    agency: string | null;
    license: string | null;
    jobDesignation: string | null;
}

export class User {
    // constructor id
    email: string;
    constructor(email: string) {
        this.email = email;
    }

    // create user or agent
    async create(formObj: UserFormData): Promise<{success: boolean, message: string}>{

        const { email, password, passwordConfirm, firstName, lastName, country, phoneNumber, ceaNumber, agency, license, jobDesignation } = formObj;

        if (password !== passwordConfirm) {
            return { success: false, message: "Passwords do not match" }
        }

        // check if user exists already
        const userExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (userExists) {
            return { success: false, message: "User already exists" }
        }

        // hash raw password
        const passwordHash = await encryptPassword(password);


        const user = await prisma.user.create({
            data: {
                email: email,
                passwordHash: passwordHash,
                firstName: firstName,
                lastName: lastName,
                country: country,
                phoneNumber: phoneNumber,
                role: ceaNumber && agency && license && jobDesignation ? 'AGENT' : 'USER'
            }
        })

        // check if agent
        if (ceaNumber && agency && license && jobDesignation) {
            await prisma.agent.create({
                data: {
                    ceaNumber: ceaNumber,
                    agency: agency,
                    license: license,
                    jobDesignation: jobDesignation,
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })
        }
        
        return {success:true, message: "User created successfully"};
    }

    // get user info
    async getInfo() {
        // get user info from db
        const userInfo = await prisma.user.findUnique({
            where: {
                email: this.email
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                country: true,
                phoneNumber: true
                // TODO: add bookmark later
            }
        })

        return userInfo
    }

    // get user role
    async getRole() {
        // get role from db
        const role = await prisma.user.findUnique({
            where: {
                email: this.email
            },
            select: {
                role: true
            }
        })


        return role;
    }

    // set password
    async setPassword(password: string) {
        const hash = await this.hashPassword(password);

        // save hash to db
        await prisma.user.update({
            where: {
                email: this.email
            },
            data: {
                passwordHash: hash
            }
        })
    }

    // create password hash
    async hashPassword(password: string) {
        const hash = encryptPassword(password);
        return hash
    }

    // get bookmarks
    async getBookmarks() {
        // return bookmarks;
    }

    // save property
    async saveProperty() {
        // save property
    }
    
}

export class Agent extends User {
    constructor(email: string) {
        super(email);
    }

    // create listing
    async createListing() {
        // create listing
    }

    // get listing
    async getListing() {
        // get listing
    }

    // update listing
    async updateListing() {
        // update listing
    }

    // delete listing
    async deleteListing() {
        // delete listing
    }
}


// admin class

export class Admin extends User {
    constructor(email: string) {
        super(email);
    }

    // get all users
    async getUsers() {
        const users = await prisma.user.findMany()
        return users;
    }

    // delete user
    async deleteUser(email: string) {
        await prisma.user.delete({
            where: {
                email: email
            }
        })
    }

    // get all agents
    async getAgents() {
        const agents = await prisma.agent.findMany()
        return agents;
    }
}