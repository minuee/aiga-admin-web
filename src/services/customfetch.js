
// 하단 how to use 참고
class CustomAPiFetch {

    // '', null, undefinded, 빈객체{} 체크
    isEmpty = str => {
        return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
    };

    // call API with timeout Function, default limit = 30 seconds
    callAPI = async (url, options = null, FETCH_TIMEOUT = 30000, requiredLogin = false, signal = null) => {
        const myTimeout = this.isEmpty(FETCH_TIMEOUT) ? 30000 : FETCH_TIMEOUT;
        ///console.log("optionsoptions 222", options.headers)
        return this.requestAPI(url, options, myTimeout, signal);
    };

    requestAPI = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
        const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];

        try {
            if (options === null) {
                options = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                };
            } else {
                // headers를 new Headers로 넘기면 map 으로 넘어옴.
                // 그냥 headers: {}, new Headers({}) 모두 허용위해 newHeaders로 받음
                // headers 대소문자 구분으로 인해 변화 후 사용
                const tmpHeaders = options.headers
                ? typeof options.headers.map !== 'undefined'
                    ? options.headers.map
                    : options.headers
                : {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    };
                let arrHeaders = [];
                let arrHeaderKeys = [];
                Object.keys(tmpHeaders).forEach(item => {
                    arrHeaders[item.toLowerCase()] = tmpHeaders[item];
                    arrHeaderKeys.push(item.toLowerCase());
                });

                let newHeaders = {};
                arrHeaderKeys.forEach((value, index) => {
                let objKey = '';
                if (value === 'accept') {
                    objKey = 'Accept';
                } else if (value === 'content-type') {
                    objKey = 'Content-Type';
                } else if (value === 'apikey') {
                    objKey = 'ApiKey';
                } else {
                    objKey = value;
                }
                const obj = {[objKey]: arrHeaders[value]};
                newHeaders = {...newHeaders, ...obj};
                });
                const contentType =
                options.method && options.method.toUpperCase() === 'POST'
                    ? 'multipart/form-data'
                    : options.method && options.method.toUpperCase() === 'PUT' || options.method && options.method.toUpperCase() === 'DELETE'
                    ? 'application/x-www-form-urlencoded'
                    : 'application/json; charset=UTF-8';
                const receivedApiKey = newHeaders.ApiKey ? newHeaders.ApiKey : newHeaders.apiKey;
                options.headers = {
                ...newHeaders,
                // 'authorization': receivedApiKey ? receivedApiKey : null,
                };
            }

            const response = await this.fetchWithTimout(url, options, FETCH_TIMEOUT, signal);
            const responseJson = await response.json();

            return responseJson;
        } catch (error) {

            throw new Error(error);
        }
    };

    // fetch with timeout
    fetchWithTimout = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
        return Promise.race([
        fetch(url, options, signal),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
        ),
        ]);
    };



}

const CustomFetch = new CustomAPiFetch();
export default CustomFetch;

