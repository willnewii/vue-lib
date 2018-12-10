<template>
    <div class="scroll-view">
        <!--<mu-refresh-control :refreshing="refreshing" :trigger="scroller" @refresh="refresh"/>-->
        <div class="header">
            <slot name="header"></slot>
        </div>
        <div v-if="type == 'list'">
            <template v-for="item, index in data">
                <div @click="onItemClick(index,$event)" :button="true" :ripple="!disableRipple">
                    <!--<div class="item"></div>-->
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
                <mu-divider v-if="isNeedDivider && data.length-1 != index"/>
            </template>
        </div>
        <div class="grid" v-else-if="type == 'grid'">
            <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
                <div class="item">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <slot name="footer"></slot>
        <mu-infinite-scroll v-if="isMore && !update" :scroller="scroller" :loading="loading" @load="loadMore"
                            loadingText="数据加载中..."/>
        <div class="empty-view" v-if="data.length <= 0 && !loading">
            <slot v-if="$slots['empty-view']" name="empty-view"></slot>
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
            type: {//列表类型
                type: String,
                default: 'list'//grid
            },
            //可以绑定页面的刷新值.比如tabIindex,type等值.当该值发生改变,listview将执行刷新.
            //flag 为空,默认不发起请求
            flag: {
                type: [Number, String],
                default: 0
            },
            isNeedLoadMore: {//是否需要加载更多
                type: Boolean,
                default: true
            },
            cols: {//显示列数当type = grid 时 使用
                type: Number,
                default: 3
            },
            aspectRatio: {//item的宽高比，当type = grid 时 使用
                type: Number,
                default: 1 / 1
            },
            isNeedDivider: {//是否显示分割线
                type: Boolean,
                default: true
            },
            emptyMsg: {//无数据时的提示文案
                type: String,
                default: '没有数据'
            },
            pageOption: {//分页参数和默认值
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
            disableRipple: {//是否开启android 涟漪效果
                type: Boolean,
                default: false
            },
            isFreeze: {//是否冻结当前数组
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scroller: null,     //滑动容器
                page: this.pageOption.startPage.value,
                scrollTop: 0,
                loading: false,
                isMore: true,
                data: [],
                update: false,          //下拉刷新标记位 未使用
                refreshing: false,      //下拉刷新标记位 未使用
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
            onItemClick(index, event) {
                this.$emit('onItemClick', this.data[index], index);
            },
            init() {
                this.isMore = true;
                this.page = this.pageOption.startPage.value;
                this.data = [];
            },
            refresh() {
                this.$emit('onRefresh');
                this.isMore = true;
                this.page = this.pageOption.startPage.value;
                //this.data = []; 刷新是采用不清空数据.获取数据后替换的规则
                this.update = true;
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

                    let _data = [];
                    if (this.update) {
                        _data = result;
                        this.update = false;
                    } else {
                        _data = this.data.concat(result);
                    }
                    this.data = this.isFreeze ? Object.freeze(_data) : _data;

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