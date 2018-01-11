const name = 'vuelib';

const install = function (Vue, options = {}) {
    Vue.prototype['$' + name] = options;
};

export {install};