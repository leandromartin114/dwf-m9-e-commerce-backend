import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { generateToken } from "lib/jwt";
import { sgMail } from "lib/sendgrid";

// const seed = process.env.RANDOM_SEED;
// without seed the code is totally random
const random = gen.create();

export async function findAuth(email: string) {
	const auth = await Auth.findByEmail(email);
	if (auth) {
		return auth;
	} else {
		return null;
	}
}
export async function createAuth(data) {
	const auth = await findAuth(data.email);
	if (auth) {
		console.log("The user already exists");
		return false;
	} else {
		const newUser = await User.createNewUser({
			email: data.email,
			fullName: data.fullName,
			address: data.address,
		});
		const newAuth = await Auth.createNewAuth({
			email: data.email,
			userId: newUser.id,
			code: 0,
			expires: new Date(),
		});
		console.log("New user created");
		return newAuth;
	}
}

export async function sendCode(email: string) {
	const auth = await findAuth(email);
	if (auth) {
		const code = random.intBetween(10000, 99999);
		const now = new Date();
		const tenMinutesExpDate = addMinutes(now, 10);
		auth.data.code = code;
		auth.data.expires = tenMinutesExpDate;
		await auth.push();
		const msg = {
			to: email,
			from: "leandrom.roldan@gmail.com",
			subject: "Código de validación",
			html: `<h1>${code}</h1>
			<p>Con este código podés loguearte. Recordá que el mismo es válido durante 10 minutos</p>
			`,
		};
		await sgMail.send(msg);
		console.log("Email sent to " + email);
		return code;
	} else {
		console.error("The user doesn't exist");
		return false;
	}
}

export async function sendToken(email: string, code: number) {
	const auth = await Auth.findByEmailAndCode(email, code);
	if (!auth) {
		return null;
	}
	const expired = auth.isCodeExpired();
	if (expired) {
		console.error("Expired code");
		return expired;
	} else {
		const token = generateToken({ userId: auth.data.userId });
		const now = new Date();
		auth.data.expires = now;
		auth.push();
		return token;
	}
}

// export async function findOrCreateAuth(data) {
// 	const auth = await Auth.findByEmail(data.email);
// 	if (auth) {
// 		console.log("Auth encontrado");
// 		return auth;
// 	} else {
// 		const newUser = await User.createNewUser({
// 			email: data.email,
// 			fullName: data.fullName,
// 			address: data.address,
// 		});
// 		const newAuth = await Auth.createNewAuth({
// 			email: data.email,
// 			userId: newUser.id,
// 			code: "",
// 			expires: new Date(),
// 		});
// 		console.log("new Auth creado");
// 		return newAuth;
// 	}
// }
