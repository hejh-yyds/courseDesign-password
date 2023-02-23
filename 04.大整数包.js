
// 定义一个数据类型，大整数类型
// 构造函数，接收数字，或者数字字符串
// 接收本身类型
function BigNum(numStr){
    // 判断类型是否位BigNum类型
    if(numStr instanceof BigNum){
        this.num=numStr.num.concat([])
    }else{
        if(typeof numStr!=='string'){
            numStr=''+numStr
        }
        // 参数为表示一个大整数的字符串
        // 构造函数
        // 对普通Number类型num进行改造
        this.num=[]
        let len=numStr.length
        for(let i=0;i<len;i++){
            // console.log(numStr[]);
            // 最高位为-3说明为负数
            let code=numStr.charCodeAt(len-i-1)-48
            this.num.push(code)
        }
    }
}


// BigNum的原型方法，a.modAdd(b) 
BigNum.prototype.modAdd=function(b){
    // 参数为参与运算的bignum类型
    // console.log(b instanceof BigNum);
    if(b instanceof BigNum){
        throw new Error('参数类型必须为BigNum')
    }

    const type=getType(this,b)
    const result=modAddHandle[type](this,b)

    return result
}

// 判断本身是否为正数
BigNum.prototype.isPlus=function(){
    return this.num[this.num.length-1]!==-3
}

// a，b的绝对值（正值）比较
BigNum.prototype.compare=function(b){
    // a比较b
    let alen=a.num.length
    let blen=b.num.length

    if(alen<blen){
        return -1
    }else if(alen>blen){
        return 1
    }else{
        // 长度相同，逐位比较
        let res=0
        for(let i=alen-1;i>=0;i--){
            if(a.num[i]>b.num[i]){
                res=1
                break
            }else if(a.num[i]<b.num[i]){
                res=-1
                break
            }
        }
        return res
    }
}



// 模加处理函数
let modAddHandle={
    // 双方为正的处理
    '0':function(a,b){
        let _newArr=[]
        // 取长的一段
        let len=a.num.length<b.num.length? b.num.length:a.num.length
        // 进位
        let carry=0
        for(let i=0;i<len;i++){

            let opt1=a.num[i]
            let opt2=b.num[i]
            if(!a.num[i]){
                opt1=0
            }
            if(!b.num[i]){
                opt2=0
            }
            let temp=opt1+opt2+carry
            // 可能产生进位
            carry=temp/10
            // 余数
            let rest=temp%10


            // 余数作为当前位的结果
            _newArr.push(rest)
        }

        // 判断最高位是否发生了进位
        if(carry!==0){
            _newArr.push(carry)
        }

        let bigNum=new BigNum()
        bigNum.num=_newArr
        return bigNum
    },


    // 双方为负的处理
    '1':function(a,b){
        // 全部转换位正数
        let a1=new BigNum(a)
        let b1=new BigNum(b)
        
        a1.num.pop()
        b1.num.pop()

        let res=this['0'](a1,b1)

        // res要进行处理，最高位push -3
        res.num.push(-3)
        return res
    },

    // 一正一负数的处理
    '2':function(a,b){
        // 直接做减法
        let result=null
        if(a.isPlus()){
            let newB=new BigNum(b)
            newB.num.pop()
            result =modSubHandle['0'](a,newB)
        }

        // -a+b
        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            result=modSubHandle['0'](b,newA)
        }
    }
}

// 正数的相加
const plusModAdd=(a,b)=>{
    // 进行非常简单的操作
    // 就是a-b，参数已经保证了a>b
    let newRes=new BigNum('')
    let alen=a.num.length
    let blen=b.num.length

    // 取其长
    let len=alen>blen? alen:blen

    for(let i=0;i<len;i++){
        let opt1=a.num[i]? a.num[i]:0
        let opt2=b.num[i]? b.num[i]:0

        // 减不下
        if(opt1<opt2){
            opt1+=10
            // 同时高位借1
            a.num[i+1]--
        }
        let res=opt1-opt2
        newRes.num.push(res)

    }

    return newRes
}

// 参数a,b的正负数情况判断
const getType=(a,b)=>{
    if(a.isPlus()&&b.isPlus()){
        return '0'
    }else if(!a.isPlus()&&!b.isPlus()){
        return '1'
    }else{
        return '2'
    }
}

// 模减处理函数
let modSubHandle={

    // a,b同时为正
    '0':function(a,b){
        // 先比较a，b的大小
        // a>b a-b
        // a<b -(b-a)
        // a=b
        let res=a.compare(b)
        let result=null
        if(res===1){
            result=plusModAdd(a,b)
        }else if(res===0){
            result=new BigNum(0)
        }else{
            result=plusModAdd(b,a)
            // 最高位push -3
            result.num.push(-3)
        }

        return result
    },

    // a,b同时为负数
    '1':function(a,b){
        // -a + -b
        return modAddHandle['1'](a,b)
    },

    // a,b 一正一负
    '2':function(a,b){
        let result=null
        //+a -b
        if(a.isPlus()){
            // 把b转换为正数
            let newB=new BigNum(b)
            newB.num.pop()
            result=this['0'](a,newB)
        }

        // b-a
        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            result=this['0'](b,newA)
        }

        return result
    }
}

modAddHandle['1'](new BigNum(-33),new BigNum(-33))



