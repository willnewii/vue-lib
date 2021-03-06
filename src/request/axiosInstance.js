import axios from 'axios';
import axiosOption from './axiosOption';

const axiosInstance = axios.create(axiosOption);

axiosInstance.interceptors.request.use(function (config) {

    let key = config.method !== 'get' ? 'data' : 'params';
    config[key].app_env = process.env.NODE_ENV;
    config[key].app_version = process.env.APP_VERSION;
    config[key].app_model = navigator.userAgent;

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

/**
 * 这里会按照约定好的api格式做简单的校验.可以根据需要配置
 */
axiosInstance.interceptors.response.use((response) => {
    console.log('axiosInstance-defaults');
    let result = response.data;

    if (typeof result === 'string') {
        result = JSON.parse(result);
    }
    if (result && 'ret' in result) {//&& 'data' in result
        if (result.ret === 200) {
            return result;
        } else {
            return Promise.reject(result);
        }
    } else {
        //EventBus.$emit(Constants.EventBus.showToast, {message: '接口异常'});
        return Promise.reject({
            msg: 'api 不符合规范',
            data: result
        });
    }
}, (error) => {
    if (error.message === 'Network Error') {//网络异常
        console.log(error.message, '请检查网络连接是否正常.');
        return;
    }
    console.log(error.message);
});

export default axiosInstance;
