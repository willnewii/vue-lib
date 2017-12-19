import autoListView from 'src/components/AutoListView';

const install = function (Vue, mixins) {
    if (mixins) {
        autoListView.mixins = mixins;
    }
    Vue.component(autoListView.name, autoListView);
};

export {install};