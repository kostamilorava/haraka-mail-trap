const axios = require('axios');

let inboundMailUrl = '';
let apiToken = '';


exports.register = function () {
    this.loginfo('Loaded HTTP email forwarder plugin');

    inboundMailUrl = process.env.INBOUND_MAIL_URL;
    apiToken = process.env.API_TOKEN;

    this.register_hook('data_post', 'forward_email');
};


exports.forward_email = function (next, connection) {

    connection.transaction.notes.discard = true;

    if (!connection?.transaction) return next();

    connection.transaction.message_stream.get_data((str) => {
        axios
            .post(
                inboundMailUrl,
                {
                    data: str.toString()
                },
                {
                    timeout: 1000,
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            )
            .then(() => {
                connection.loginfo(this, 'Data forwarded to Laravel');
                return next(OK);
            })
            .catch((err) => {
                connection.logerror(this, `Forward failed: ${err.message}`);
                return next();
            });
    });
};
