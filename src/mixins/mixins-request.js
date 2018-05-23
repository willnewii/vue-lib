import Request from '../request/Request';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequestJsonP(url, param, success, error, finish) {
            request.jsonp(url, param, success, this.handleError, finish);
        },
        doRequestPost(url, param, success, error, finish) {
            request.post(url, param, success, this.handleError, finish);
        },
        doRequest(url, param, success, error, finish) {
            request.get(url, param, success, this.handleError, finish);
        },
        doRequests(requests, success) {
            return request.all(requests, success);
        },

        handleError(error) {
            console.log('request_error:', error);
            if (error && 'msg' in error) { //接口错误
                console.error('接口异常', error.data.msg);
            } else {
                console.error('请求异常', error);
            }
        }
    }
};
