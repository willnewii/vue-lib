// import autoListView from './components/AutoListView';

/*import MuRefreshControl from "muse-ui/src/refreshControl/refreshControl.vue";
import MuInfiniteScroll from "muse-ui/src/infiniteScroll/infiniteScroll.vue";
import MuList from "muse-ui/src/list/list.vue";
import MuListItem from "muse-ui/src/list/listItem.vue";
import MuDivider from "muse-ui/src/divider/divider.vue";*/

const name = 'vuelib';

const install = function (Vue, options = {}) {
    Vue.prototype['$' + name] = options;

    //列表组件
/*    Vue.component(MuRefreshControl.name, MuRefreshControl);
    Vue.component(MuList.name, MuList);
    Vue.component(MuListItem.name, MuListItem);
    Vue.component(MuInfiniteScroll.name, MuInfiniteScroll);
    Vue.component(MuDivider.name, MuDivider);*/

    // Vue.component(autoListView.name, autoListView);
};

export {name, install};