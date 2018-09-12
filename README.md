#### AutoListView

- 参数

| 参数        | 说明    |
| --------   | -----   |
| url | 请求地址 |
| type| list /grid|
| cols| 列数,当type为grid生效|
| notify| 类似一个trigger,修改该值,通知控件进行刷新     |
| pageOption| 分页参数的配置,可以根据项目自定义参数。默认为0页,10条     |
| aspectRatio| 在grid模式下,item显示比例.如果小于0,不设置高     |
| flag| 有时你需要通知控件刷新,你可以变更该值(true 为刷新控件,false 为重置).当你并不需要控件一载入就加载数据时,也可以传入一个false.     |
|disableRipple|是否使用 android 涟漪效果|
|isFreeze|是否冻结数组,如果纯展示,可开启|
|isNeedDivider|是都显示List分割线|

- 方法

| method        | 说明    |
| --------   | -----   |
| onItemClick | 返回当前item对象 |

- Parent

| method        | 说明    |
| --------   | -----   |
| handleParam | 处理请求参数 |
| handleResult| 处理返回结果,可能接口返回的不能直接用过list,可以通过这个函数处理一下.|

- solt

| name        | 说明    |
| --------   | -----   |
| header | 头部view |

- style

| 说明    |
| -----   |
|最后一条item不会显示分隔线|