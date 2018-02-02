jest.mock('make-fetch-happen', () => {
    const magentoConfig = {
        gotConfig: true
    };
    const res = {
        json: jest.fn().mockReturnValue(Promise.resolve(magentoConfig))
    };
    const fakeFetch = jest.fn().mockReturnValue(Promise.resolve(res));
    fakeFetch.__fetch = fakeFetch;
    fakeFetch.__res = res;
    fakeFetch.__magentoConfig = magentoConfig;
    return fakeFetch;
});
const fetch = require('make-fetch-happen');
const getMagentoEnv = require('../pwa-config-endpoint');

test('returns a rejected Promise with an error if called with no arg', () =>
    expect(getMagentoEnv()).rejects.toHaveProperty(
        'message',
        expect.stringContaining('No Magento domain specified')
    ));
test('calls fetch with the Magento wpconfig endpoint of the domain', () =>
    getMagentoEnv('https://example.com').then(env => {
        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/webpack-config.json',
            expect.objectContaining({
                strictSSL: false,
                timeout: 60000
            })
        );
        expect(fetch.__res.json).toHaveBeenCalled();
        expect(env).toBe(fetch.__magentoConfig);
    }));

test('passes options as the second argument to fetch and merges defaults', () =>
    getMagentoEnv('https://example.com', {
        followRedirects: false,
        strictSSL: true
    }).then(env => {
        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/webpack-config.json',
            expect.objectContaining({
                followRedirects: false,
                strictSSL: true,
                timeout: 60000
            })
        );
        expect(fetch.__res.json).toHaveBeenCalled();
        expect(env).toBe(fetch.__magentoConfig);
    }));
test('rejects if the fetch fails', () => {
    fetch.__fetch.mockReturnValueOnce(Promise.reject(Error('oh no')));
    return expect(getMagentoEnv('https://example.com')).rejects.toHaveProperty(
        'message',
        'oh no'
    );
});
test('rejects with timeout out if the timeout ms is reached', () => {
    // jest.useFakeTimers();
    fetch.__fetch.mockReturnValueOnce(
        new Promise(res => setTimeout(res, 10000))
    ); // resolves in 10
    return expect(
        getMagentoEnv('https://example.com', { timeout: 2000 })
    ).rejects.toHaveProperty(
        'message',
        expect.stringContaining(
            'Request to get Magento dev config endpoint from https://example.com timed out'
        )
    );
    jest.runAllTimers();
});
