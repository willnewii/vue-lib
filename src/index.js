import autoListView from './components/AutoListView';

const install = function (Vue, mixins) {
    if (mixins) {
        autoListView.mixins = mixins;
    }
    Vue.component(autoListView.name, autoListView);
};

export {install};