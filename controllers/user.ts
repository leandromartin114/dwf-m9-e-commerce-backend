import { Auth } from "models/auth";
import { User } from "models/user";

export async function getUserData(userId) {
	const user = new User(userId);
	await user.pull();
	if (user) {
		return user.data;
	} else {
		return null;
	}
}

export async function updateUser(userId, data) {
	const user = new User(userId);
	await user.pull();
	if (data.email) {
		const auth = await Auth.findByEmail(user.data.email);
		user.data.email = data.email;
		auth.data.email = data.email;
		auth.push();
	}
	if (data.fullName) {
		user.data.fullName = data.fullName;
	}
	if (data.address) {
		user.data.address = data.address;
	}
	await user.push();
	return user.data;
}
