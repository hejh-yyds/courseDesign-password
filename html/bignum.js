
// 定义一个数据类型，大整数类型
// 构造函数，接收数字，或者数字字符串
// 接收本身类型
function BigNum(numStr=''){

    // 判断数据类型
    if(typeof numStr !=='number'&&typeof numStr!=='string'&& (!(numStr instanceof BigNum))){
        throw new Error('数据类型只能是number，string，BigNum')
    }
    // 判断类型是否位BigNum类型
    if(numStr instanceof BigNum){
        this.num=numStr.num.concat([])
    }else{

        if(typeof numStr==='number'){
            if( numStr<-Infinity||numStr>Infinity){
                throw new Error('超过显示范围请输入数字字符串')
            }
            numStr=numStr.toString(10)
        }

        // 判断数字字符串是否合法
        for(let i=0;i<numStr.length;i++){
            if(numStr.charCodeAt(i)<48||numStr.charCodeAt(i)>57){
                if(numStr.charCodeAt(i)!==45){
                    throw new Error('数字字符串不合法')
                }
            }
        }

        // 是字符串类型
        numStr=''+numStr
        console.log(numStr);
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

// 判断本身是否为正数
BigNum.prototype.isPlus=function(){
    return this.num[this.num.length-1]!==-3
}

// a，b的绝对值（正值）比较
BigNum.prototype.compare=function(b){
    // a比较b
    let alen=this.num.length
    let blen=b.num.length

    if(alen<blen){
        return -1
    }else if(alen>blen){
        return 1
    }else{
        // 长度相同，逐位比较
        let res=0
        for(let i=alen-1;i>=0;i--){
            if(this.num[i]>b.num[i]){
                res=1
                break
            }else if(this.num[i]<b.num[i]){
                res=-1
                break
            }
        }
        return res
    }
}


// bigNum类型转换为字符串显示
BigNum.prototype.toString=function(){

    // let num=this.num.filter(item=>item!==0)
    let res=''
    let flag=false
    for(let i=this.num.length-1;i>=0;i--){

        // 去除无用的前0
        if(this.num[i]!==0&&!flag){
            flag=true
        }
        if(flag){
            if(this.num[i]===-3){
                res+='-'
                continue
            }
            res+=this.num[i]
        }   
    }
    console.log(res);
}


// BigNum的原型方法，a.modAdd(b) 
BigNum.prototype.modAdd=function(b){
    // 参数为参与运算的bignum类型
    console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    const type=getType(this,b)
    const result=modAddHandle[type](this,b)

    return result
}

// BigNum的原型方法，a.modAdd(b) 
BigNum.prototype.modSub=function(b){
    // 参数为参与运算的bignum类型
    console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    const type=getType(this,b)
    const result=modSubHandle[type](this,b)

    return result
}

// BigNum的原型方法，模乘法
BigNum.prototype.modMul=function(b){
    // 参数为参与运算的bignum类型
    console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }
    // a*b
    // b个a相加
    // i循环次数

    // 考虑正负数 a*b -a*-b a*-b -a*b   -- a*b -a*b
    let type=getType(this,b)

    return modMulHandle[type](this,b)

}

// BigNum的原型方法，就是取一个模数
// 参数为一个模数
BigNum.prototype.mod=function(p){
    let val=new BigNum(this)
    // 如果p为负，加到正
    let zero=new BigNum('0')

    let pyload=new BigNum(p)

    let res=val.compare(zero)
    
    if(res<0){
        // 直接加到正
        while(!val.isPlus()){
            val= val.modAdd(pyload)
        }
    }else{
        // 直接减小到负
        while(val.isPlus()){
            val= val.modSub(pyload)
        }
        // 我们在加上这个
        val=val.modAdd(pyload)
    }

    return val
    // p>=0 减
}

// BigNum的原型方法，模整除法
BigNum.prototype.modDiv=function(b){
    // 做一个减法， 统计次数（大 数）
    // (a/b)mod(p)


}

// BigNum的原型方法，模取余
BigNum.prototype.modRest=function(){

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


// 正数相减
const plusModSub=(a,b)=>{
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
            // 高位可能会小于0
            let k=i+1
            while(a.num[k]<0){
                a.num[k]+=10
                // 外高位是不是减1
                k++
                a.num[k]--
            }
        }
        let res=opt1-opt2
        newRes.num.push(res)

    }

    return newRes
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
            carry=Math.floor(temp/10)
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
        // a-b
        let result=null
        if(a.isPlus()){
            let newB=new BigNum(b)
            newB.num.pop()
            result =modSubHandle['0'](a,newB)
        }

        // -a+b  b-a
        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            result=modSubHandle['0'](b,newA)
        }

        return result
    }
}


// 模减处理函数
let modSubHandle={

    // a,b同时为正
    // a-b
    '0':function(a,b){
        // 先比较a，b的大小
        // a>b a-b
        // a<b -(b-a)
        // a=b
        let res=a.compare(b)
        let result=null
        if(res===1){
            result=plusModSub(a,b)
        }else if(res===0){
            result=new BigNum(0)
        }else{
            result=plusModSub(b,a)
            // 最高位push -3
            result.num.push(-3)
        }

        return result
    },

    // a,b同时为负数 -a - -b   b 和-a 相加
    '1':function(a,b){

        let newB=new BigNum(b)
        newB.num.pop()
        // -a - -b
        return modAddHandle['2'](newB,a)
    },

    // a,b 一正一负
    // a --b  (a+b)
    // -a - b  -(a+b)
    '2':function(a,b){
        let result=null
        //a - -b
        if(a.isPlus()){
            // 把b转换为正数
            let newB=new BigNum(b)
            newB.num.pop()
            result=modAddHandle['0'](a,newB)
        }

        // -a -b  -a + -b
        if(b.isPlus()){
            let newB=new BigNum(b)
            newB.num.push(-3)
            result=modAddHandle['1'](a,newB)
        }

        return result
    }
}

const modMulHandle={
    // a,b同时为正
    // a*b
    '0':function(a,b){
        // 先比较a，b的大小
        // a>b  
        // a<b 
        // a=b
        // 取小的作为循环次数
        let res=a.compare(b)
        // 循环变量
        let i=new BigNum('1')
        // 循环+1
        let c=new BigNum('1')
        // 累加的值
        let sum=new BigNum('0')

        // 每次加的值
        let val=null
        // 循环次数
        let len=null
        
        if(res>=0){
            // a>=b
            val=new BigNum(a)
            len=new BigNum(b)
        }else{
            val=new BigNum(b)
            len=new BigNum(a)
        }

        // i<b
        while(i.compare(len)<1){
            sum=sum.modAdd(val)
            // i++
            i= i.modAdd(c)
        }

        return sum
    },

    // a,b同时为负数 -a*-b  a*b
    '1':function(a,b){

        let newB=new BigNum(b)
        newB.num.pop()
        let newA=new BigNum(a)
        newA.num.pop()
        // -a - -b
        return this['0'](newA,newB)
    },

    // a,b 一正一负
    // a *-b  -(a*b)
    // -a * b  -(a*b)
    '2':function(a,b){
        let result=null
        //a * -b
        if(a.isPlus()){
            // 把b转换为正数
            let newB=new BigNum(b)
            newB.num.pop()
            result=this['0'](a,newB)
        }

        // -a *b  
        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            result=this['0'](newA,b)
        }

        result.num.push(-3)

        return result
    }
}

// modAddHandle['1'](new BigNum(-33),new BigNum(-33))


// let a=new BigNum(-199999)
// let b=new BigNum(200000)
// a.modAdd(b).toString()

// new BigNum('9000000000000000000000000000000000').modSub(new BigNum('-4000000000000000000000000000000000000000000000000000000000000000000000000000000000000')).toString()


// new BigNum('3').modMul(new BigNum('400')).toString()



new BigNum('30').mod(16).toString()


