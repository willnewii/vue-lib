import Request from '../request/Request';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequest(url, param, success, error, finish) {

            request.post(url, this.handleParam(param), success, this.handleError, finish);
        },
        doRequests(requests, success) {
            return request.all(requests, success);
        },
        handleParam(param) {
            if (!param) {
                param = {};
            }

            param.app_env = process.env.NODE_ENV;
            param.app_version = process.env.APP_VERSION;
            param.app_model = navigator.userAgent;
            return param;
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
