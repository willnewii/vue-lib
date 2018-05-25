import Request from '../request/Request';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequestJsonP(url, param, success, error, finish) {
            request.jsonp(url, this.handleParams(param), success, error || this.handleError, finish);
        },
        doRequestPost(url, param, success, error, finish) {
            request.post(url, this.handleParams(param), success, error || this.handleError, finish);
        },
        doRequest(url, param, success, error, finish) {
            request.get(url, this.handleParams(param), success, error || this.handleError, finish);
        },
        doRequests(requests, success) {
            return request.all(requests, success);
        },
        handleParams(param){//如果需要传递前置参数,但又跟Vue环境相关,可重写该方法
            return param;
        },
        handleError(error) {
            console.log('接口异常:', error);
        }
    }
};
