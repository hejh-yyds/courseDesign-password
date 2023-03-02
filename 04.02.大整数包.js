// 定义一个数据类型，大整数类型
// 构造函数，接收数字，或者数字字符串
// 接收本身类型
function BigNum(numStr=''){

    // 判断数据类型
    if(typeof numStr !=='number'&&typeof numStr!=='string'&& (!(numStr instanceof BigNum))){
        throw new Error('数据类型只能是number,string,BigNum')
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
        // console.log(numStr);
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

    // 去除前导0
    while(this.num[this.num.length-1]===0&&this.num.length>1){
        this.num.pop()
    }
}

// BigNum转普通number类型
BigNum.prototype.toNumber=function(){
    

    // 判断正负，
    if(this.isPlus()){
        let len=this.num.length
        if(len>15){
            throw new Error('直接转换会结果不正确,可以进行取模后再转换')
        }
        // 低位开始加
        let sum=0
        let k=1
        for(let i=0;i<len;i++){
            sum=sum+this.num[i]*k
            k=k*10
        }
        return sum
    }else{
        let len=this.num.length
        if(len>16){
            throw new Error('直接转换会结果不正确,可以进行取模后再转换')
        }
        // 低位开始加
        let sum=0
        let k=1
        for(let i=0;i<len;i++){
            if(this.num[i]===-3){
                continue
            }
            sum=sum+this.num[i]*k*-1
            k=k*10
        }
        return sum
    }
}

// 判断本身是否为正数
BigNum.prototype.isPlus=function(){
    return this.num[this.num.length-1]!==-3
}

// a，b的绝对值（a>=0 b>=0）比较
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


// 大整数整除2
BigNum.prototype.divTwo=function(){
    
    let len=this.num.length

    // 从最高位开始，做10进制除法，
    let two=2
    let rest=0
    let numStr=''
    for(let i=len-1;i>=0;i--){
        // 
        let opt1=rest*10+this.num[i]
        // 商
        let res=Math.floor(opt1/two)
        // if(res!==0){
        //     numStr+=res
        // }
        numStr+=res
        // 余数
        rest=opt1%two
    }

    // 字符串转换为bigNum类型
    return new BigNum(numStr)
}


// bigNum类型转换为字符串显示
BigNum.prototype.toString=function(){
    let res=''
    
    for(let i=this.num.length-1;i>=0;i--){
        if(this.num[i]===-3){
            res+='-'
            continue
        }
        res+=this.num[i]  
    }

    // console.log(res);

    return res
}

// 用于去除，进行单次操作（正数--->负数）后，最高位出现0的情况
BigNum.prototype.removeZero=function(){
    // 我们要除去负数的情况
    let len=this.num.length-1
    // 负数，直接越过

    
    // 对于负数
    if(this.num[len]===-3){
        // 我们先把-3pop出来
        this.num.pop()
        len--
        
        while(this.num[len]===0&&this.num.length>1){
            this.num.pop()
            len--
        }

        this.num.push(-3)
    }else{
         // 对于正数

        while(this.num[len]===0&&this.num.length>1){
            this.num.pop()
            len--
        }
    }

   

    
}

// BigNum的原型方法，a.modAdd(b) 
BigNum.prototype.modAdd=function(b){
    // 参数为参与运算的bignum类型
    // console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    const type=getType(this,b)
    const result=modAddHandle[type](this,b)
    result.removeZero()
    return result
}

// BigNum的原型方法，a.modAdd(b) 
BigNum.prototype.modSub=function(b){
    // 参数为参与运算的bignum类型
    // console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    const type=getType(this,b)
    const result=modSubHandle[type](this,b)
    result.removeZero()
    return result
}

// BigNum的原型方法，模乘法
BigNum.prototype.modMul=function(b){
    // 参数为参与运算的bignum类型
    // console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }
    // a*b
    // b个a相加
    // i循环次数

    // this 或者 b为0 直接返回0
    let zero=new BigNum('0')
    if(this.compare(zero)===0||b.compare(zero)===0){
        return new BigNum('0')
    }

    // 考虑正负数 a*b -a*-b a*-b -a*b   -- a*b -a*b
    let type=getType(this,b)

    return modMulHandle[type](this,b)

}

// BigNum的原型方法，就是取一个模数
// 参数为一个模数
BigNum.prototype.mod=function(p=2147483648){

    // a mod(p)
    // 这个p默认值为2**31，用户可以自己定义

    // 判断p的类型
    if(typeof p!=='number'){
        throw new Error('模数p只能是number类型')
    }
    if(p===0){
        throw new Error("模数p不能为0")
    }

    // 限制位数48位（其实54为是显示极限）
    if(p>281474976710656){
        throw new Error('模式p不能过大')
    }

    let newP=new BigNum(p)

    let res=this.modRest(newP)

    // 对负数结果进行处理，+newP

    if(!res.isPlus()){
        res=res.modAdd(newP)
    }

    // 将res转换为num类型

    return res.toNumber()
    // 
    // 进行 a%p  ---- > 结果 
}

// BigNum的原型方法，模整除
BigNum.prototype.modDiv=function(b){
    // console.log(b instanceof BigNum);
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    // 判断一下b是不是0
    // let res=b.compare(new BigNum('0'))
    // 做一个减法， 统计次数（大 数）
    // (a/b) a一直减b，直到不能a为负数，次数为结果

    // (-a/-b)

    // 获取一下a，b类型
    let type=getType(this,b)
    return modDivHandle2[type](this,b)
}

// BigNum的原型方法，幂
BigNum.prototype.modPow=function(b,m=new BigNum("2147483648")){
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    // a**b

    let one=new BigNum('1')
    let zero=new BigNum('0')
    let two=new BigNum('2')
    
    if(this.compare(zero)===0){
        throw new Error('底数不能为0')
    }
    // 判断b的正负
    if(!b.isPlus()){
        throw new Error('参数类型必须大于等于0的整数')
    }

    
    if(this.compare(new BigNum('1'))===0){
        return new BigNum('1').modRest(m)
    }
    if(b.compare(zero)===0){
        return new BigNum('1').modRest(m)
    }


    function modMRec(a, power, mod)
    {
        // assert(a>=1 && power >=0 && mod >=1);
        if (power.compare(zero) === 0) {
            return new BigNum('1').modRest(mod);
        }
        if (power.compare(one)===0) {
            return a.modRest(mod);
        }
        if (power.num[0]%2!==0) {
            let temp = modMRec(a, power.divTwo(), mod);
            return  (temp.modMul(temp).modMul(a)).modRest(mod);
        } 
        else {
            let temp = modMRec(a, power.divTwo(), mod);
            return  (temp.modMul(temp)).modRest(mod);
        }
    }


    // let getPow=(a,b)=>{
    //     // 首先保证，a!=0,b>0
    //     let one=new BigNum('1')
    //     // 当b为1是
    //     if(b.compare(one)===0){
    //         // 直接返回a
    //         return a
    //     }

    //     // 先求b/2 ,有余数，和没有余数
    //     let zero=new BigNum('0')
    //     let two=new BigNum('2')
    //     let k=b.divTwo()
    //     let res=b.modSub(k.modMul(two))
        

    //     // b-k*2===0? 
    //     if(res.compare(zero)===0){
    //         // let k1=new BigNum()
    //         return getPow(a,k).modMul(getPow(a,k))
    //     }else{
    //         let k2=new BigNum(k)
    //         k2=k2.modAdd(one)
    //         return getPow(a,k).modMul(getPow(a,k2))
    //     }
        
    // }

    return modMRec(this,b,m)
}

// BigNum的原型方法，模取余
BigNum.prototype.modRest=function(b){
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }
    // a%b ，-a%-b   -a%b  a%-b

    let type=getType(this,b)
    
    return modRestHandle[type](this,b)

}

// BigNum的原型方法，求a和b的最大公约数
BigNum.prototype.modGcd=function(b){
    if(!(b instanceof BigNum)){
        throw new Error('参数类型必须为BigNum')
    }

    if(!this.isPlus()||!b.isPlus()){
        throw new Error("a和b必须为正整数")
    }

    let zero=new BigNum('0')
    // if(this.compare(zero)===0||b.compare(zero)===0){
    //     throw new Error('a和b不能为0')
    // }


    let r=null
    let newA=null
    let newB=null
    // a<b
    if(this.compare(b)===-1){
        newA=new BigNum(b)
        newB=new BigNum(this)
    }else{
        newA=new BigNum(this)
        newB=new BigNum(b)
    }

    while(newB.compare(zero)!==0){
        r=newA.modRest(newB)
        newA=newB
        newB=r
    }
    
    
    
    return newA;

    
}

// BigNum的原型方法，求a和b的乘法逆元
BigNum.prototype.modExGcd=function(b){

    let exgcd=( Coprime_Number1, Coprime_Number2, Inverse_Of_X, Inverse_Of_Y)=>	
    {
        if (Coprime_Number2.compare(new BigNum('0'))===0)     //gcd(Coprime_Number1,0)=Coprime_Number1。
        {
            Inverse_Of_X = new BigNum('1');
            Inverse_Of_Y = new BigNum('0');
            return [Inverse_Of_X,Inverse_Of_Y]
        }

	    let arr=exgcd(Coprime_Number2, Coprime_Number1.modRest(Coprime_Number2), Inverse_Of_X, Inverse_Of_Y);      
	    let Middle_Number = arr[1];
		Inverse_Of_Y = arr[0].modSub((Coprime_Number1.modDiv(Coprime_Number2)).modMul(arr[1]));
		Inverse_Of_X = Middle_Number;
        return [Inverse_Of_X,Inverse_Of_Y]
    }

    // 判断this和b是否互素
    let one=new BigNum('1')
    if((this.modGcd(b)).compare(one)!==0){
        // 不为1
        throw new Error('a与b不互素')
    }


    let x=new BigNum()
    let y=new BigNum()

    let res=exgcd(this,b,x,y)


    let result=res[0]

    // 逆元小于0，转换为正数

    if(!result.isPlus()){
        // 加上b，直到为正

        // 求一下 +result/b=k
        // (k+1)*b+result

        let resultPlus=new BigNum(result)
        resultPlus.num.pop()

        let k=resultPlus.modDiv(b)

        k=k.modAdd(one)

        result=k.modMul(b).modAdd(result)

    }

    

    return result
}


// 生成大素数


// 正数相减
const plusModSub=(a,b)=>{
    // 进行非常简单的操作
    // 就是a-b，参数已经保证了a>b
    let newRes=new BigNum('')
    let alen=a.num.length
    let blen=b.num.length

    let newA=new BigNum(a)

    // 取其长
    let len=alen>blen? alen:blen

    for(let i=0;i<len;i++){
        let opt1=newA.num[i]? newA.num[i]:0
        let opt2=b.num[i]? b.num[i]:0

        // 减不下
        if(opt1<opt2){
            opt1+=10
            // 同时高位借1
            newA.num[i+1]--
            // 高位可能会小于0
            let k=i+1

            // 高位继续向高位借位，因为a>b 所有高位总是有借
            while(newA.num[k]<0){
                newA.num[k]+=10
                // 外高位是不是减1
                k++
                newA.num[k]--
            }
        }
        let res=opt1-opt2
        newRes.num.push(res)

    }

    return newRes
}

// 模加处理函数
const modAddHandle={
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
const modSubHandle={

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

// 模乘处理函数
// 不使用加法进行，直接使用十进制的乘法
const modMulHandle={
    // a,b同时为正
    // a*b
    '0':function(a,b){
        // 进行十进制乘法
        // 判断长度是否相同
        let alen=a.num.length
        let blen=b.num.length
        // 取其长,长的在上，短的在下
        let newA=null
        let newB=null
        if(alen>blen){
            newA=new BigNum(a)
            newB=new BigNum(b)
        }else{
            newA=new BigNum(b)
            newB=new BigNum(a)
        }

        let newBLen=newB.num.length
        let newALen=newA.num.length
        
        // 每次个位数的乘法累加到这里
        let sum=new BigNum('0')
        // 短的外层循环，长的里层循环
        for(let i=0;i<newBLen;i++){
            let carry=0
            // 记录单次 个位数与大整数的乘法
            let paload=new BigNum('')
            for(let j=0;j<newALen;j++){
                let opt1=newA.num[j]
                let opt2=newB.num[i]

                // 做十进制乘法
                let addRes=opt1*opt2+carry

                // 10取余作为当前位
                let rest=addRes%10
                paload.num.push(rest)
                // 进位
                carry=Math.floor(addRes/10)
            }

            // 将进位push到payload（个位数（0-9）与大整数的乘法，其实最高进位也就是8）
            while(carry>0){
                paload.num.push(carry%10)
                carry=Math.floor(carry/10)
            }

            // 得到和个位数相乘的大整数
            // 在相加之前要冲零（移位相加），低位加0
            for(let m=0;m<i;m++){
                paload.num.unshift(0)
            }

            // 进行相加
            sum=sum.modAdd(paload)
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

// 模整除
const modDivHandle={
    // a/b
    '0':function(a,b){
        // 这里已经保证了a，b都是正数
        // 比较a,b
        // 判断a，b的情况
        let zero=new BigNum('0')
        let one=new BigNum('1')
        if(b.compare(zero)===0){
            throw new Error('除数不能为0')
        }
        if(a.compare(zero)===0){
            // a为0
            return new BigNum('0')
        }


        let res=a.compare(b)
        let result=null
        if(res===1){
            /* 统计a被减小成负数的次数

            这个次数通过二分查找得到，范围为 10的(差值-1) 到 10的（差值+1） 
            
            在二分范围内，看能不能找到整除的（或者left，向下取整） 这样就得到了次数

            其中要使用 BigNum/2   这里除2 可以模拟计算实现
            
            */
            // 新的a，可以改变
            let newA=new BigNum(a)
            // 计算a，b的差值，即长度相差几
            let alen=newA.num.length
            let blen=b.num.length
            let len=alen-blen
            // 生成二分查找的范围
            let left='1'
            let right='1'
            for(let s=0;s<(len-1);s++){
                left=left+'0'
            }
            for(let s=0;s<(len+1);s++){
                right=right+'0'
            }

            let newLeft=new BigNum(left)
            let newRight=new BigNum(right)

            // 开始二分，得到中间值，与b相乘，a-结果，判断大小
            while(newLeft.compare(newRight)<=0){
                // let mid=new BigNum()
                let mid=(newLeft.modAdd(newRight)).divTwo()

                let payload=b.modMul(mid)

                let result=a.modSub(payload)

                // let res=result.compare(zero)
                // 结果大于0

                if(result.isPlus()){

                    // >=0
                    let res=result.compare(zero)
                    if(res===1){
                        // 可以往右取
                        // >0
                        newLeft=mid.modAdd(one)
    
                    }else if(res===0){
                        // 结果等于
                        newRight=mid
                        break
                    }

                }else{
                    // 结果小于0
                    newRight=mid.modSub(one)
                }
                
            }
            result=newRight
        }else if(res===0){
            result=new BigNum('1')
        }else{
            result=new BigNum('0')
        }

        return result
    },

    // -a/-b a/b
    '1':function(a,b){
        let newA=new BigNum(a)
        let newB=new BigNum(b)
        newA.num.pop()
        newB.num.pop()
        return this['0'](newA,newB)
    },

    // -a/b  a/-b
    '2':function(a,b){
        let res=null
        if(a.isPlus()){
            let newB=new BigNum(b)
            newB.num.pop()
            res=this['0'](a,newB)
        }

        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            res=this['0'](newA,b)
        }

        // 结果为不为0的处理
        if(res.compare(new BigNum('0'))!==0){
            res.num.push(-3)
        }
        return res
    }
}


// function divHandle(a,b){
//     // let newA=new BigNum(a)
//     // let newB=new BigNum(b)

//     let arrA=[...a.num].reverse()
//     // let arrB=[...b.num]

//     let standLen=b.num.length

//     let start=0
//     let end=standLen
//     let zero=new BigNum('0')

//     let optA=new BigNum()
//     let optB=new BigNum(b)
//     let str=''

//     // arrA 高位在前
//     while(end<=arrA.length){
//         // 从start-end
//         optA.num=arrA.slice(start,end).reverse()
        
//         if(optA.compare(optB)===-1){
//             // str+='0'
//             end++
//         }else{
//             // 取1-9
//             let left=1
//             let right=9
//             let val=null
//             while(left<=right){
//                 let mid=Math.floor( (left+right)/2)
//                 val=new BigNum(mid)
//                 let res=optA.modSub(val.modMul(optB))
                
//                 if(res.isPlus()){
//                     if(res.compare(zero)===0){
//                         right=mid
//                         break
//                     }else{
//                         left=mid+1
//                     }
//                 }else{
//                     right=mid-1
//                 }
//             }

//             str+=right

//             // 取right
//             let k=new BigNum(right)
            

//             // 余数
//             let rest=optA.modSub(k.modMul(optB))

//             // 新的optA,修改arrA
//             arrA=rest.num.reverse().concat(arrA.slice(end))

//             if(arrA.length>=optB.num.length){
//                  // 看余数的位数与b的位数的差距
//                 let step=optB.num.length-rest.num.length
//                 // 要先进行下一次的运算，位数需要补齐
//                 // arrA.length 可用的位数
//                 for(let i=0;i<step&&i<arrA.length;i++){
//                     str+='0'
//                 }
//             }

           

            
//             // end归于b的长度
//             end=standLen

//         }
//         // optA =k个optB

//     }

//     console.log(str);

//     return new BigNum(str)
// }

// 模整除

function divHandle(a,b){
    // a>b

    // b的位数小于等于a的位数

    // 每次计算，将b的位数扩展到a的位数相同

    let newA=new BigNum(a)
    let newB=new BigNum(b)

    let map={}

    let zero=new BigNum('0')

    
    let flag=false

    while(newA.num.length>=newB.num.length){
        
        let optB=new BigNum(b)
        if(newB.num.length<newA.num.length){
            // b扩展位数
            let step=newA.num.length-newB.num.length
            while(step>0){
                // 最低位补0
                optB.num.unshift(0)
                step--
            }
        }

        // a,b位数相同
        // 算a=k*b 0<=k<=9

        
        while(newA.compare(optB)===-1){
             // a<b
            // 说明除不下，扩大位数少一点
            if(optB.num.length<=newB.num.length){
                // 说明不能缩小了，终止计算
                flag=true
                break
            }else{
                // 缩小一位
                optB.num.shift()
            }
        }

        if(flag){
            break
        }

        // 到这里说明a>=b
        // 找到a=k*b k=1-9

        let left=1
        let right=9
        let val=null
        while(left<=right){
            let mid=Math.floor( (left+right)/2)
            val=new BigNum(mid)
            let res=newA.modSub(val.modMul(optB))
            
            if(res.isPlus()){
                if(res.compare(zero)===0){
                    right=mid
                    break
                }else{
                    left=mid+1
                }
            }else{
                right=mid-1
            }
        }

        // right即为k
        map[optB.num.length]=right

        // 计算余数
        let rest=newA.modSub(new BigNum(right).modMul(optB))
        

        // newA要发生变化，变为余数
        newA.num=rest.num

    }

    console.log(map);

    // 对map进行处理
    let max=-1
    for(let key in map){
        if(key>max){
            max=key
        }
    }

    let str=''
    for(let i=newB.num.length;i<=max;i++){
        if(map[i]){
            str=map[i]+str
        }else{
            str='0'+str
        }
    }

    return new BigNum(str)

}
const modDivHandle2={
    // a/b
    '0':function(a,b){
        // 这里已经保证了a，b都是正数
        // 比较a,b
        // 判断a，b的情况
        let zero=new BigNum('0')
        let one=new BigNum('1')
        if(b.compare(zero)===0){
            throw new Error('除数不能为0')
        }
        if(a.compare(zero)===0){
            // a为0
            return new BigNum('0')
        }


        let res=a.compare(b)
        let result=null
        if(res===1){
            // a>b
            result=divHandle(a,b)
        }else if(res===0){
            result=new BigNum('1')
        }else{
            result=new BigNum('0')
        }

        return result
    },

    // -a/-b a/b
    '1':function(a,b){
        let newA=new BigNum(a)
        let newB=new BigNum(b)
        newA.num.pop()
        newB.num.pop()
        return this['0'](newA,newB)
    },

    // -a/b  a/-b
    '2':function(a,b){
        let res=null
        if(a.isPlus()){
            let newB=new BigNum(b)
            newB.num.pop()
            res=this['0'](a,newB)
        }

        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            res=this['0'](newA,b)
        }

        // 结果为不为0的处理
        if(res.compare(new BigNum('0'))!==0){
            res.num.push(-3)
        }
        return res
    }
}

// 模取余的处理函数
const modRestHandle={

    // a,b同为正
    '0':function(a,b){

        let zero=new BigNum('0')
        // 判断a，b是否为0
        if(b.compare(zero)===0){
            throw new Error("分母不能为0")
        }

        // 分子是0，直接返回0
        if(a.compare(zero)===0){
            // throw new Error("分子不能为0")
            return new BigNum('0')
        }

        // 判断a，b的大小关系
        // let res=a.compare(b)
        let newA=null
        let newB=null
        
        // if(res===1){
        //     // a>b ,先做a/b得到k，在做a-kb得到余数
        //     newA=new BigNum(a)
        //     newB=new BigNum(b)
        // }else if(res===0){
        //     return new BigNum('0')
        // }else{
        //     newA=new BigNum(b)
        //     newB=new BigNum(a)
        // }

        newA=new BigNum(a)
        newB=new BigNum(b)

        let k=newA.modDiv(newB)

        let result=newA.modSub(newB.modMul(k))
        return result
    },

    // -a%-b
    '1':function(a,b){
        // -(a%b)
        let newA=new BigNum(a)
        newA.num.pop()
        let newB=new BigNum(b)
        newB.num.pop()

        // 做正数的取余
        let res=this['0'](newA,newB)

        // 把得到的结果加上负数
        // 结果为不为0的处理
        if(res.compare(new BigNum('0'))!==0){
            res.num.push(-3)
        }

        return res
    },

    // 一正一负 
    '2':function(a,b){
        // -a %b

        let result=null
        if(b.isPlus()){
            let newA=new BigNum(a)
            newA.num.pop()
            result=this['0'](newA,b)
            // 结果加上负数

            // 结果为不为0的处理
            if(result.compare(new BigNum('0'))!==0){
                result.num.push(-3)
            }
            // result.num.push(-3)
        }

        if(a.isPlus()){
            let newB=new BigNum(b)
            newB.num.pop()
            result=this['0'](a,newB)
            // 结果不需要加上负数
        }

        return result
    }

}

// modAddHandle['1'](new BigNum(-33),new BigNum(-33))


// let a=new BigNum(-199999)
// let b=new BigNum(200000)
// a.modAdd(b).toString()

// new BigNum('9000000000000000000000000000000000').modSub(new BigNum('-4000000000000000000000000000000000000000000000000000000000000000000000000000000000000')).toString()


// new BigNum('3').modMul(new BigNum('400')).toString()



// new BigNum('1000').modSub(new BigNum('999')).toString()

// for(let m=0;m<3000;m++){
// new BigNum('10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000').modMul(new BigNum('10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')).toString()

// }

// new BigNum('69').modDiv(new BigNum('0')).toString()


// new BigNum('300').modRest(new BigNum('11')).toString()

// new BigNum('128').modGcd(new BigNum('256')).toString()


// new BigNum('6934632205262527509995804380416867068535395330154489281905435698800439954202461355900562409208503562815863409156966238766953947161462918365858580041561322501600847').modPow(new BigNum('94677773010036570419889453981105849625861850895828035916817838631609933443742008292183764499360753108748375571480692827514781370870922067772727543441031357018575063517503221466940')).toString()


// new BigNum('1').modGcd(new BigNum('0')).toString()

// new BigNum('7').modExGcd(new BigNum('71')).toString()
// console.log(new BigNum('701235435654').modAdd(new BigNum('777666666655555')).mod());

// console.log(new BigNum('701235435654').modAdd(new BigNum('777666666655555')).toString());

// console.log(new BigNum('222227777712734').toNumber() );

 


 
    
 
    
 
    
 
/**
 * Miller-Rabin测试
 *
 * @param n 生成的那个bigNum
 * @return
 */
function passesMillerRabin(n) {
    // base随机生成，不大于2**32-1
    let base = 0;
    if (n.compare(new BigNum('2147483647')) < 0) {
        // 1-value
        base = Math.floor( Math.random()* parseInt(n.toString())) + 1;
    } else {
        base = Math.floor(Math.random()*2147483647) + 1;
    }

    base=new BigNum(base)

    let one=new BigNum('1')
    
    // n-1
    let thisMinusOne = n.modSub(one);
    let m = thisMinusOne;

    // 为偶数
    while (m.num[0]%2===0) {
        // /2
        m = m.divTwo();
        // let z = expmod(base, m, n);
        let z=base.modPow(m,n)

        if (z.compare(thisMinusOne)===0) {
            break;
        } else if (z.compare(one)===0) {

        } else {
            return false;
        }
    }
    return true;
}

function isPrime(n) {
    //copy自jdk源码, n的bit数越多, 需要的检测次数就越少
    //注释说是根据标准 ANSI X9.80, "PRIME NUMBER GENERATION, PRIMALITY TESTING, AND PRIMALITY CERTIFICATES".
    //我不知道为什么
    let sizeInBits = n.num.length;
    let tryTime = 0;
    if (sizeInBits < 33) {
        tryTime = 50;
    }

    if (sizeInBits < 85) {
        tryTime = 27;
    } else if (sizeInBits < 170) {
        tryTime = 15;
    } else if (sizeInBits < 256) {
        tryTime = 8;
    } else if (sizeInBits < 341) {
        tryTime = 4;
    } else {
        tryTime = 2;
    }
    return isPrime2(n, tryTime);
}

/**
 * 多次调用素数测试, 判定输入的n是否为质数
 *
 * @param n
 * @param tryTime
 * @return
 */
function isPrime2( n, tryTime) {
    for (let i = 0; i < tryTime; i++) {
        if (!passesMillerRabin(n)) {
            return false;
        }
    }
    return true;
}

/**
 * 产生一个n bit的素数
 *
 * @param bitCount
 * @return
 */
function getPrime(bitCount) {
    //随机生成一个n bit的大整数
    // BigInteger init = new BigInteger(bitCount, ran);

    let str=''
    for(let i=0;i<bitCount;i++){
        str=str+Math.floor(Math.random()*10)
    }
    let init=new BigNum(str)
    let one =new BigNum('1')
    let two=new BigNum('2')
    //如果n为偶数, 则加一变为奇数
    if (init.num[0]%2===0) {
        init = init.modAdd(one);
    }

    let i = 0;
    //基于素数定理, 平均只需要不到n次搜索, 就能找到一个素数
    while (!isPrime(init)) {
        i++;
        init = init.modAdd(two);
    }
    //System.out.println(String.format("try %d\ttimes", i));
    return init;
}

// console.log('最终的数',getPrime(100).toString()); 
// getPrime(2)


// console.log(modDivHandle2['0'](new BigNum('111111'),new BigNum('5000')).toString()); 


