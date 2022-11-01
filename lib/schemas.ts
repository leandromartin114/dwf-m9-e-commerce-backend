import * as yup from "yup";

let orderQuerySchema = yup.mixed();

let orderBodySchema = yup
	.array()
	.of(
		yup
			.object()
			.shape({
				title: yup.string().required(),
				quantity: yup.number().required(),
				currency_id: yup.string().required(),
				unit_price: yup.number().required(),
				color: yup.string().optional(),
				materials: yup.string().optional(),
			})
			.noUnknown(true)
			.strict()
	)
	.strict();

let newUserBodySchema = yup
	.object()
	.shape({
		fullName: yup.string().required(),
		email: yup.string().email().required(),
		address: yup.string().required(),
	})
	.noUnknown(true)
	.strict();

let userDataQuerySchema = yup
	.string()
	.matches(/(email|fullName|address)/, "It's not a valid parameter");

let userDataBodySchema = yup
	.object()
	.shape({
		content: yup.string().required(),
	})
	.noUnknown(true)
	.strict();

export {
	orderQuerySchema,
	orderBodySchema,
	newUserBodySchema,
	userDataQuerySchema,
	userDataBodySchema,
};
