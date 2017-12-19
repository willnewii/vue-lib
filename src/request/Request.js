/**
 * Created by zhangweiwei on 2017/04/10.
 */

import axiosInstance from './axiosInstance';

class Request {

    constructor(page, axios) {
        this.page = page;
        this.axios = axios || axiosInstance;
    }

    static handleParam(param) {

    }

    getOption() {
        return this.axios.defaults;
    }

    post(url, param, success, fail, finish) {
        return this._request(url, 'post', param, success, fail, finish);
    }

    get(url, param, success, fail, finish) {
        return this._request(url, 'get', param, success, fail, finish);
    }

    _request(url, type, param, success, fail, finish) {
        if (!url) {
            console.log('链接为空');
            return;
        }

        url = url.indexOf('http') === 0 ? url : this.getOption().baseURL + '?' + url;

        this.getOption().method = type;

        //处理基础请求参数
        param = Request.handleParam(param);
        let request;
        switch (this.getOption().method) {
            case 'get':
                this.getOption().params = param;
                request = this.axios.get(url);
                break;
            default:
                this.getOption().data = param;
                request = this.axios[type](url, null);
        }
        request.then((response) => {
            success && success(response.data, response);
            finish && finish();
        }).catch((error) => {
            fail && fail(error);
            finish && finish();
        });

        return request;
    }

}

export default Request;
