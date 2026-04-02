import JwtUtils from '../utils/jwt-utils';
import constant from '../const/constant';

const userContext = {
	getUserId(c) {
		const user = c.get('user');
		if (user?.userId != null) {
			return Number(user.userId);
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

	async getToken(c) {
		const jwt = c.req.header(constant.TOKEN_HEADER);
		const { token } = JwtUtils.verifyToken(c,jwt);
		return token;
	},
};
export default userContext;
