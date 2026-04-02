import app from '../hono/hono';

// Auth is fully disabled: all requests pass through without JWT/public-token/permission checks.
app.use('*', async (_c, next) => {
	return await next();
});
