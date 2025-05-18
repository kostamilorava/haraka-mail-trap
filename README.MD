<h1 style="text-align: center">Haraka Mail Trap</h1>

# Info

This repository contains Haraka configuration as well as dockerfile that:

* Listens to SMTP
* When email is received, calls auth endpoint
* If auth endpoint returns status 200, it forwards plain email text to third party service

You can use `ghcr.io/kostamilorava/haraka-mail-trap:latest` in docker compose or commands.

# Required variables

In order to make it work, you will ned 3 variables:

* AUTH_URL - Url of third party service which will check if this email sender is authenticated
* INBOUND_MAIL_URL - Url of third party service which will receive email text
* API_TOKEN - Bearer token that will be used to check auth and email forward request