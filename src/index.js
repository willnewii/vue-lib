import autoListView from './components/AutoListView';

import {List,Divider,LoadMore} from 'muse-ui';

const name = 'vuelib';

const install = function (Vue, options = {}) {
    Vue.prototype['$' + name] = options;

    //列表组件
    Vue.component(autoListView.name, autoListView);

    Vue.use(List);
    Vue.use(Divider);
    Vue.use(LoadMore);
};

export {name, install};

/**
import autoListView from './components/AutoListView';
import MuInfiniteScroll from "muse-ui/src/infiniteScroll/infiniteScroll.vue";

const name = 'vuelib';

const install = function (Vue, options = {}) {
    Vue.prototype['$' + name] = options;

    //列表组件
    Vue.component(autoListView.name, autoListView);
    Vue.component(MuInfiniteScroll.name, MuInfiniteScroll);
};

export {name, install};
 */
