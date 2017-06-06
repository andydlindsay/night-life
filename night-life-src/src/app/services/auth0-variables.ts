interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: '8I1zKtSUa3UwEVBmDXjbYsP4mIJy0lt8',
    CLIENT_DOMAIN: 'andydlindsay.auth0.com',
    AUDIENCE: 'https://andydlindsay.auth0.com/userinfo',
    REDIRECT: 'http://andydlindsay-night-life.herokuapp.com/callback',
    SCOPE: 'openid user_metadata'
};