let store = {
    save (key, val){
        localStorage.setItem(key, JSON.stringify(val));
    },
    get (key){
        return JSON.parse( localStorage.getItem(key) ) || [];
    }
}

//取出所有的值
let list = store.get('todo')
/*let list = [
    {
        title: '标题',
        isChecked: true
    },
    {
        title: '标题2',
        isChecked: false
    }
];*/
//过滤的时候有三种情况 all finshed unfinshed
var filter = {
    all: function (list){
        return list;
    },
    finished: function (list){
        return list.filter(function (item){
            return item.isChecked;
        });
    },
    unfinshed: function (list){
        return list.filter(function (item){
            return !item.isChecked;
        });
    }
}

let vm = new Vue({
    el: '.main',
    data: {
        list: list,
        todo: '',
        //记录正在编辑的数据
        editor: '',
        //老标题
        oldTitle: '',
        //通过这属性值的变化对数据进行筛选
        visibility: 'all'
    },
    //监控
    watch: {
        list: {
            handler: function (){
                store.save('todo', this.list);
            },
            deep: true
        }
    },
    //计算属性
    computed: {
        noCheckLen: function (){
            return this.list.filter(function (item){
                return !item.isChecked
            }).length
        },
        //过滤数据
        filteredList: function (){
            
            //找到了过滤函数，就返回过滤后的数据，如果没有，返回所有数据
            return filter[this.visibility] ? filter[this.visibility](list) : list;
        }
    },
    //方法
    methods: {
        add (ev){
            /*console.log(222)*/
            /*if( ev.keyCode === 13 ){
                this.list.push({
                    title: ev.target.value
                })
            }*/
            this.list.push({
                title: this.todo,
                isChecked: false,                
            });
            this.todo = '';
        },
        del (todo){
            var index = this.list.indexOf(todo);
            this.list.splice(index, 1);
            console.log(index);
        },
        //编辑
        edit (todo){
            // console.log(todo);
            this.editor = todo;
            //记录老标题
            this.oldTitle = todo.title;
        },
        //确认编辑
        confirm (){
            // console.log(todo);
            this.editor = '';
        },
        //取消编辑
        cancle (todo){
            todo.title = this.oldTitle;
            this.oldTitle = '';
            //div显示，input隐藏
            this.editor = '';
        }
    },
    //自定义指令
    directives: {
        focus(el, binding) {
            if(binding.value){
                el.focus();
            }
        }
    }
});
function watchHashChange(){
    var hash = location.hash.slice(1);
    
    vm.visibility = hash;
    console.log(vm.visibility);
}
watchHashChange();
window.addEventListener('hashchange', watchHashChange);