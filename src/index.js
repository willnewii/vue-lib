import autoListView from './components/AutoListView';
import MuInfiniteScroll from "./components/infiniteScroll";

const name = 'vuelib';

const install = function (Vue, options = {}) {
    Vue.prototype['$' + name] = options;

    //列表组件
    Vue.component(autoListView.name, autoListView);
    Vue.component(MuInfiniteScroll.name, MuInfiniteScroll);

    //依赖 muse-ui 3.0 {Progress, Divider, List}
};

export {name, install};