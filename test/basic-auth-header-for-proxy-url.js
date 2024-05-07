const test = require('ava');
const basicAuthHeaderForProxyUrl = require('../source/proxies/basic-auth-header-for-proxy-url')

test.serial('Passes proxy username and password without any URL encoding', t => {
    const proxyUrl = new URL('http://user;name:p+ssword@example.com');

    const expectedUsername = 'user;name';
    const expectedPassword = 'p+ssword';

    const expectedBase64Part = Buffer
        .from(`${expectedUsername}:${expectedPassword}`)
        .toString('base64');

    const expectedHeader = `Basic ${expectedBase64Part}`;

    const actualHeader = basicAuthHeaderForProxyUrl(proxyUrl);
    t.is(actualHeader, expectedHeader);
});

test.serial('Throws when credentials contain lone %', t => {
    // According to RFC 1738, username and password
    // cannot contain % that is not followed by 2 hexadecimal
    // digits
    //
    // See user, password, and uchar here:
    // https://datatracker.ietf.org/doc/html/rfc1738#section-5
    //
    // Hence they are unlikely to be used in the wild

    const urls = [
        new URL('http://%ser:password@example.com'),
        new URL('http://user:p%ssword@example.com'),
    ];

    // TODO: maybe error message is too cryptic?

    for (const url of urls) {
        t.throws(() => basicAuthHeaderForProxyUrl(url));
    }
});
