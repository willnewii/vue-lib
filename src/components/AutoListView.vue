<template>
    <div class="scroll-view">
        <!--<mu-refresh-control :refreshing="refreshing" :trigger="scroller" @refresh="refresh"/>-->
        <slot name="header"></slot>
        <mu-list v-if="type == 'list'">
            <template v-for="item, index in data">
                <mu-list-item @click="onItemClick(index)" :disableRipple="disableRipple">
                    <!--<div class="item"></div>-->
                    <slot name="item" :item="item" :index="index"></slot>
                </mu-list-item>
                <mu-divider v-if="isNeedDivider && data.length-1 != index"/>
            </template>
        </mu-list>
        <div class="grid" v-else-if="type == 'grid'">
            <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
                <div class="item">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <slot name="footer"></slot>
        <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                            loadingText="数据加载中..."/>
        <div class="empty-view" v-if="data.length <= 0 && !loading">
            <slot v-if="customeEmptyView" name="empty-view"></slot>
            <div v-else class="empty-message">{{emptyMsg}}</div>
        </div>
    </div>
</template>

<script>
    import minixs_request from '../mixins/mixins-request';

    export default {
        name: 'AutoListView',
        mixins: [minixs_request],
        props: {
            url: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'list'//grid
            },
            cols: {
                type: Number,
                default: 3
            },
            //可以绑定页面的刷新值.比如tabIindex,type等值.当该值发生改变,listview将执行刷新.
            //flag 为空,默认不发起请求
            flag: {
                type: [Number, String],
                default: 0
            },
            isNeedLoadMore: {
                type: Boolean,
                default: true
            },
            //宽高比，grid 中使用
            aspectRatio: {
                type: Number,
                default: 1 / 1
            },
            isNeedDivider: {
                type: Boolean,
                default: true
            },
            customeEmptyView: {
                type: Boolean,
                default: false
            },
            emptyMsg: {
                type: String,
                default: '没有数据'
            },
            pageOption: {
                type: Object,
                default() {
                    return {
                        startPage: {
                            name: 'page',
                            value: 0
                        },
                        pageSize: {
                            name: 'pageSize',
                            value: 10
                        }
                    };
                }
            },
            disableRipple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                refreshing: false,
                scroller: null,
                scrollTop: 0,
                page: this.pageOption.startPage.value,
                loading: false,
                isMore: true,
                data: []
            };
        },
        watch: {
            flag: function (val, oldVal) {
                if (val !== null) {
                    this.refresh();
                } else {
                    this.init();
                }
            },
        },
        mounted() {
            this.scroller = this.$el;
            this.scroller.onscroll = () => {
                this.scrollTop = this.scroller.scrollTop;
            };
            this.$emit('onMounted');
        },
        activated() {
            if (this.scrollTop !== 0) {
                this.scroller.scrollTop = this.scrollTop;
            }
        },
        computed: {
            gridstyle() {
                let style = getComputedStyle(this.$el);
                let width = (this.$el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)) / this.cols;
                return {
                    width: width + 'px',
                    height: this.aspectRatio < 0 ? 'auto' : width / this.aspectRatio + 'px',
                };
            }
        },
        created() {
            if (this.flag !== null) {
                this.getdata();
            }
        },
        methods: {
            onItemClick(index) {
                this.$emit('onItemClick', this.data[index], index);
            },
            init() {
                this.isMore = true;
                this.page = this.pageOption.startPage.value;
                this.data = [];
            },
            refresh() {
                this.$emit('onRefresh');
                this.init();
                this.getdata();
            },
            getdata() {
                this.loading = true;

                let param = {};
                param[this.pageOption.startPage.name] = this.page;
                param[this.pageOption.pageSize.name] = this.pageOption.pageSize.value;

                if (this.$parent.handleParam) {
                    param = Object.assign(this.$parent.handleParam(), param);
                }

                this.doRequest(this.url, param, (result) => {
                    if ('handleResult' in this.$parent) {
                        result = this.$parent.handleResult(result);
                    }
                    this.data = this.data.concat(result);

                    if (result.length === 0 || result.length < this.pageOption.pageSize.value) {
                        this.isMore = false;
                    } else {
                        this.page = this.page + 1;
                    }

                    if (!this.isNeedLoadMore) {
                        this.isMore = false;
                    }
                }, () => {
                    this.isMore = false;
                }, () => {
                    // this.refreshing = false;
                    this.loading = false;
                });
            },
            loadMore() {
                this.getdata();
            },
        }
    };
</script>

<style lang="scss" scoped>
    @import "AutoListView";

    .mu-infinite-scroll {
        padding-top: 10px;
    }
</style>