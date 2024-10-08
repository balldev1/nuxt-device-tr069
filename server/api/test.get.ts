import prisma from "~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const data: any = await prisma.parametertest.findMany();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
});
