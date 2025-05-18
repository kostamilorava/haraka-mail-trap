exports.register = function () {
    const requiredVars = ['AUTH_URL', 'INBOUND_MAIL_URL'];

    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length) {
        this.logcrit(`Missing required environment variables: ${missing.join(', ')}`);
        throw new Error(`Plugin fatal: Missing env vars: ${missing.join(', ')}`);
    }
};
