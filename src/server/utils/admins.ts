import db from "../db";
import { Role } from "../generated/prisma/index";
import bcrypt from "bcrypt";

const ADMINS = ["Gabriel"];

let count = 0;
const salt = await bcrypt.genSalt(10);
for (const admin of ADMINS) {
	const userExists = await db.user.findUnique({
		where: { username: `admin@${admin}` },
	});
	if (!userExists) {
		await db.user.create({
			data: {
				username: `admin@${admin}`,
				password: await bcrypt.hash("admin", salt),
				role: Role.ADMIN,
			},
		});
		console.log(`Admin ${admin} creado!`);
		count++;
	}
}
console.log(`Se crearon ${count} admins!`);
