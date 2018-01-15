/**
 * Created by zhangweiwei on 2017/04/10.
 */

import * as index from '../index';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import axiosInstance from './axiosInstance';

/**
 * 根据配置初始化
 * axiosInstance,优先级最高
 * 还有的场景,不需要重置axiosInstance,但是需要配置axiosOption
 */
class Request {

    constructor(page) {
        this.page = page;

        let lib = page['$' + index.name];
        if (lib.axiosInstance) {
            this.axios = lib.axiosInstance;
        } else {
            this.axios = axiosInstance;
            lib.axiosOption && (this.axios.defaults = Object.assign(this.axios.defaults, lib.axiosOption));
        }
    }

    getOption() {
        return this.axios.defaults;
    }

    jsonp(url, param, success, fail, finish) {
        return this._request(url, 'jsonp', param, success, fail, finish);
    }

    post(url, param, success, fail, finish) {
        return this._request(url, 'post', param, success, fail, finish);
    }

    get(url, param, success, fail, finish) {
        return this._request(url, 'get', param, success, fail, finish);
    }

    all(requests, success) {
        let requestArray = [];
        requests.forEach((item) => {
            requestArray.push(this.post(item.url, item.data));
        });
        axios.all(requestArray).then(axios.spread((...args) => {
            success && success(args);
        }));
    }

    _request(url, type, param, success, fail, finish) {
        if (!url) {
            console.log('链接为空');
            return;
        }
        url = url.indexOf('http') === 0 ? url : this.getOption().baseURL + '?' + url;

        this.getOption().method = type;

        let request;
        switch (this.getOption().method) {
            case 'get':
                this.getOption().params = param;
                request = this.axios.get(url);
                break;
            case 'jsonp':
                this.getOption().params = param;
                this.getOption().adapter = jsonpAdapter;
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
