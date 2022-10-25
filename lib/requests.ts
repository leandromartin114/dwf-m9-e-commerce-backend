import type { NextApiRequest } from "next";

export function getOffsetAndLimitFromReq(
	req: NextApiRequest,
	maxLimit: number,
	maxOffset: number
) {
	const queryLimit = parseInt(req.query.limit as string);
	const queryOffset = parseInt(req.query.offset as string);
	const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
	const offset = queryOffset < maxOffset ? queryOffset : 0;
	return {
		limit,
		offset,
	};
}
