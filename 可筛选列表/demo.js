var person = [
    { name: '刘小华', src: '1.jpg', sex: 'male', des: '漂亮的女孩子' },
    { name: '王花', src: '2.jpg', sex: 'male', des: '漂亮的程序猿' },
    { name: '陈军', src: '3.jpg', sex: 'female', des: '我是一个学霸' },
    { name: '王华', src: '4.jpg', sex: 'female', des: '我喜欢游泳' },
    { name: '陈思思', src: '5.jpg', sex: 'male', des: '我喜欢看电影' },
    { name: '马学习', src: '6.jpg', sex: 'female', des: '我爸我妈爱学习' },
    { name: '马美丽', src: '7.jpg', sex: 'male', des: '我妈是美丽得妈妈' }
];

var oUl = document.getElementById('list'),
    oInp = document.getElementById('inp'),
    sexUl = document.getElementById('sex');

//初始store
var store = createStore({text: '', sex: 'all'})

//筛选方法
var filter = {
    text: filterText,
    sex: filterSex
}

//订阅事件
store.subscribe(function(){
    render( addFunc(filter, person) );
})

/**
 * 防抖函数
 */
function debounce(handle, delay){
    delay = delay || 500;
    var timer;
    return function(){
        clearTimeout(timer)
        var self = this;
        var _args = arguments;
        timer = setTimeout(function(){
            handle.apply(self, _args);
        },delay)
    }
}

/**
 * 文字输入绑定
 */
oInp.oninput = debounce(dealInputEvent, 500);

/**
 * 文字输入事件
 */
function dealInputEvent(){
    store.dispath({type: 'text', value:this.value})     //派发（输入框文字）事件
};

//事件绑定， 让用户可以选择性别
sexUl.addEventListener('click', function(e){
    if(e.target.tagName = 'LI'){
        store.dispath({type: 'sex', value: e.target.getAttribute('sex')}) //派发（性别改变）事件
        document.getElementsByClassName('active')[0].className = '';
        e.target.className = 'active';
    }
})

/**
 * 根据list渲染dom结构
 * @param list 
 */
function render(list) {
    var str = '';
    list.forEach(ele => {
        str += '<li>\
                    <img src="./img/'+ ele.src +'" alt="" srcset="">\
                    <span class="name">'+ ele.name +'</span>\
                    <span class="des">'+ ele.des +'</span>\
                </li>'
    });
    oUl.innerHTML = str;
}

/**
 * 根据文本内容筛选
 */
function filterText(text, arr){

    return arr.filter(function(ele, index) {
        if(ele.name.indexOf(text) !== -1){  //indexOf可以实现字符串匹配
            return true;
        }
    })
}

/**
 * 根据性别进行筛选
 */
function filterSex(sex, arr){

    if(sex == 'all'){
        return arr;
    } else {

        return arr.filter(function(ele){
            if(sex == ele.sex){
                return true;
            }
        })
    }
}

/**
 * 叠加选择
 * 把多种属性一起拿来做筛选条件
 */
function addFunc(obj, arr){

    var lastArr = arr;
    for(var prop in obj){
        lastArr = obj[prop](store.getState()[prop], lastArr);   //从store中取得状态，多次筛选
    }
    //lastArr记录上一次筛选的结果
    return lastArr;
}


render(person);

