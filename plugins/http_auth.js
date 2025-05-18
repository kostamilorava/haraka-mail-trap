const axios = require('axios');


let authUrl = '';
let apiToken = '';

exports.register = function () {
    this.inherits('auth/auth_base');
    this.loginfo('Loaded HTTP auth plugin');

    this.load_ini();

    // Import env
    authUrl = process.env.AUTH_URL;
    apiToken = process.env.API_TOKEN;

    // Skip sender email and from email match check
    this.register_hook('mail', 'constrain_sender');
};

exports.load_ini = function () {
    this.cfg = this.config.get(
        'http_auth.ini',
        {
            booleans: ['+core.constrain_sender'],
        },
        () => {
            this.load_ini();
        },
    );
};

exports.hook_capabilities = function (next, connection) {
    const methods = ['PLAIN', 'LOGIN'];
    if (this.cfg.main.sysadmin) methods.push('CRAM-MD5');

    connection.capabilities.push(`AUTH ${methods.join(' ')}`);
    connection.notes.allowed_auth_methods = methods;

    next();
};


exports.check_plain_passwd = function (connection, user, passwd, cb) {
    this.loginfo('Starting AUTH HTTP check for user="' + user + '"');

    let authSuccess = false;

    axios
        .post(
            authUrl,
            {
                user,
                passwd
            },
            {
                timeout: 2000,
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        )
        .then((res) => {
            if ((authSuccess = res.status === 200)) {
                authSuccess = true;
            }
            connection.loginfo(this, `AUTH user="${user}" success=${authSuccess}`);
            cb(authSuccess);
        })
        .catch((err) => {
            connection.logerror(this, `AUTH user="${user}" success=false; error=${err.message}`);
            cb(authSuccess);
        });
};
