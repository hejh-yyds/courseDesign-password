// 省略号处理规则
// totalpages - 后端总的页数
// totalBtns - 显示的按钮总数(1,2,3....)

// totalPages<=totalBtns 正常显示


// 分页组成 ：start ...  leftaround curr rightaround ... end

// start - 序号为1的按钮（1个）
// curr  - 当前选中按钮 （1个）
// leftround - 选中按钮左侧的按钮 （2-3个）
// rightround - 选中按钮右侧的按钮 （2-3个）
// ... - 省略号按钮(1个,至少代表两个元素)
// end - 序号最后的按钮(1个)


// totalPages>totalBtns  显示不全，需要进行省略处理
    // 1. 一边出现省略号的情况
        // 1.1 前面出现省略号的临界条件 cur= startPoint = start+...+around+cur
        // 1.2 后面出现省略号的临界条件 cur= endPoint=totalpages-end-...-around

    // 2. 两边同时出现省略号的情况
        //    startPoint<=cur<=endPoint


// 我们这里定义around的个数为1个


function makePageComponent(totalPages,aroundCnt=1,currPage=1){

    // totalbtns可以动态生成
    let totalBtns=1+2+2+2*aroundCnt

    // aroundCnt=Math.floor( (myInput-5)/2)

    // 无需省略，直接输出
    let _newArr=[]
    if(totalBtns>=totalPages){
        for(let i=1;i<=totalPages;i++){
            _newArr.push(i)
        }
        return _newArr
    }

    // 要想省略功能正常，则totalBtns>=5
    if(totalBtns<5){
        return new Error('显示的分页按钮数必须大于等于5个')
    }

    // 需要省略

    let startPoint=1+2+aroundCnt+1
    let endPoint=totalPages-1-2-aroundCnt

    // 说明按钮个数太少（进入到这里，说明有省略需要，但是最小按钮数为 start+end+cur+... 4个）
    
    // <startPoint时，前面绝对不会出现省略号
    if(currPage<startPoint){
        // 只会在后面形成省略号

        for(let i=1;i<=totalBtns-2;i++){
            _newArr.push(i)
        }

        // 加上。。。 和 totalPages
        _newArr.push("...")
        _newArr.push(totalPages)
    }else if(currPage>endPoint){
        // 只会在前面生成省略号
        _newArr.push(1)
        _newArr.push("...")

        // push end
        // totalPages -(totalbtns-2)+1 ---> totalPages

        let start=totalPages-(totalBtns-2)+1

        for(let i=start;i<=totalPages;i++){
            _newArr.push(i)
        }

    }else{

        // 在中间范围，两边都有省略号
        _newArr.push(1)
        _newArr.push("...")

        // 中间按钮的个数  2*around+1

        for(let i=0;i<2*aroundCnt+1;i++){

            let val=currPage-aroundCnt+i

            _newArr.push(val)
        }


        _newArr.push("...")
        _newArr.push(totalPages)
    }

    return _newArr
}


let total=10
for(let i=1;i<=total;i++){
    let res=makePageComponent(total,1,i)

    console.log('index',i);
    console.log(res);

    console.log('-------------------');
}
