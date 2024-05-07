const test = require('ava');
const getBasicAuthHeader = require('../source/proxies/get-basic-auth-header')

test.serial('Encodes username and password as they appear in the URL', t => {
    const cases = [
        {
            url: new URL('https://user;name:p+ssword@example.com'),
            username: 'user;name',
            password: 'p+ssword'
        },

        {
            url: new URL('https://user:@example.com'),
            username: 'user',
            password: ''
        },

        {
            url: new URL('https://:password@example.com'),
            username: '',
            password: 'password'
        }
    ];

    for (const { url, username, password } of cases) {
        const expectedHeader = getExpectedHeader(username, password);
        const actualHeader = getBasicAuthHeader(url);

        t.is(actualHeader, expectedHeader, url.toString());
    }
});

function getExpectedHeader(username, password) {
    const base64Part = Buffer
        .from(`${username}:${password}`)
        .toString('base64');

    return `Basic ${base64Part}`;
}

test.serial('Throws when username/password contains lone %', t => {
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
        t.throws(() => getBasicAuthHeader(url));
    }
});

test.serial('Returns `undefined` when URL contains no username nor password', t => {
    const url = new URL('https://example.com');
    const header = getBasicAuthHeader(url);
    t.is(header, undefined);
});
