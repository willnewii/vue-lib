import Request from '../request/Request';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequestJsonP() {
            this._doRequest('jsonp', ...arguments);
        },
        doRequestPost() {
            this._doRequest('post', ...arguments);
        },
        doRequest() {
            this._doRequest('get', ...arguments);
        },
        _doRequest(type = 'get', url, param, success, error, finish) {
            this.requestStart();
            request[type](
                url,
                this.handleParams(param),
                success,
                (_error) => {
                    this.handleError(_error);
                    error && error(_error);
                },
                () => {
                    this.requestFinish(url);
                    finish && finish();
                });
        },
        doRequests(requests, success) {
            return request.all(requests, success);
        },
        handleParams(param) {//如果需要传递前置参数,但又跟Vue环境相关,可重写该方法
            return param;
        },
        handleError(error) {
            console.log('接口异常:', error);
        },
        requestStart() {

        },
        requestFinish() {
        }
    }
};
