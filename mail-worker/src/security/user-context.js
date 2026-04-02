import JwtUtils from '../utils/jwt-utils';
import constant from '../const/constant';

const userContext = {
	getUserId(c) {
		const user = c.get('user');
		if (user?.userId != null) {
			return Number(user.userId);
		}

		const jwtUserId = this.getUserIdFromJwt(c);
		if (jwtUserId != null) {
			return jwtUserId;
		}

		const headerUserId = c.req.header('x-user-id');
		if (headerUserId != null && headerUserId !== '') {
			return Number(headerUserId);
		}

		const queryUserId = c.req.query('userId');
		if (queryUserId != null && queryUserId !== '') {
			return Number(queryUserId);
		}

		return 0;
	},

	getUser(c) {
		return c.get('user') || { userId: this.getUserId(c) };
	},

	getUserIdFromJwt(c) {
		try {
			const authHeader = c.req.header(constant.TOKEN_HEADER);
			if (!authHeader) return null;
			const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
			const parts = jwt.split('.');
			if (parts.length < 2) return null;
			const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
			const padLength = (4 - (payloadBase64.length % 4)) % 4;
			const payload = atob(payloadBase64 + '='.repeat(padLength));
			const { userId } = JSON.parse(payload);
			const parsed = Number(userId);
			return Number.isNaN(parsed) ? null : parsed;
		} catch {
			return null;
		}
	},

	async getToken(c) {
		const jwt = c.req.header(constant.TOKEN_HEADER);
		const { token } = JwtUtils.verifyToken(c,jwt);
		return token;
	},
};
export default userContext;
