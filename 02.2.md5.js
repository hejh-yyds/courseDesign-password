
// 循环左移的的数组构造（success）
function getRoundleft(){

    //循环左移数组
    let roundLeft=[]
    
    let round=[
        [7,12,17,22],
        [5,9,14,20],
        [4,11,16,23],
        [6,10,15,21]
    ]


    for(let i=0;i<4;i++){
        for(let j=0;j<16;j++){
            let index=i*16+j
            let roundIndex=j%4

            roundLeft[index]=round[i][roundIndex]
        }
    }

    // console.log('循环左移数组:',roundLeft);
    return roundLeft
}

// 常数C生成函数(success)
function generateCArr(){
    let m=[]
    for(let i=0;i<64;i++){
        let res=Math.floor( Math.abs(Math.sin(i+1))*(2**32))
        
        m.push(res)
    }
    return m
}


// 整数转二进制
function intTobin(n,length=8){
    // 默认转成8位二进制
    let res=''
    for(let i=0;i<length;i++){

        let str=new String((n>>i)&1) 
        res=str+res
    }

    return res
}


// F函数
function F(X,Y,Z){
    
    return (X & Y) | ((~X) & Z)
        
}

function G(X,Y,Z){
    return (X & Z) | (Y & (~Z))
    
        
}

function H(X,Y,Z){
    return X ^ Y ^ Z  
}

function I(X,Y,Z){
    return Y ^ (X | (~Z))
}

function circle_Left(x,amount){
    x &= 0xFFFFFFFF                                       
    return (x << amount) | (x >>> (32 - amount))
}


// 消息x被分成n个512比特块，返回值二维数组
function generateXarr(message){
    // 消息长度
    let length=message.length

    // 二进制存储的字符串
    cStr=''
    // 消息的每一个字符转换为ascall码再转换为二进制数
    for(let i=0;i<length;i++){
        let code=message.charCodeAt(i)
        // TODO
        let binaryStr=intTobin(code)
        cStr+=binaryStr
    }

    // console.log('cStr:',cStr);

    // 这里可以得到比特长度

    // 判断是否为512的整数倍
    let cStrLen=cStr.length
    let initLength=cStrLen
    // let floorBlocks=Math.floor(cStrLen/512)

    // 不足448
    // 对于长度刚刚好 floorBlocks==cStrBlocks   %512=0
    // 或者剩余不足64的处理 %512>448
    // let cStrAllLen=cStrBlocks*512

    // 统一处理，直接填充到 %512==448

    // 最后一块需要进行512比特填充
    // 求余数
    let rest=cStrLen%512

    if(rest!==448){
        // 先填充1
        cStr+='1'
        // 判断长度是否到达448
        let rest2=(rest+1)%512
        while(rest2!==448){
            cStr+='0'
            // 持续填充0直到448
            rest2=(rest2+1)%512
        }
    }

    cStrLen=cStr.length
    let cStrBlocks=Math.ceil(cStrLen/512)

    // 最后64位存储比特数（cStr的长度）
    // 二进制表示
    // length长度表示8位<=255
    // >255 16位
    let lenBinary=null
    if(initLength<255){
        lenBinary=intTobin(initLength)
    }else{
        lenBinary=intTobin(initLength,16)

        // 字符串 8-16在前，0-8在后
        let leftStr=lenBinary.substring(8,16)
        let rightStr=lenBinary.substring(0,8)
        lenBinary=leftStr+rightStr
    }
    

    // 高位在前
    cStr+=lenBinary
    // 判断长度是否为64位，前补0
    if(lenBinary.length<64){
        let tempStr=''
        for(let k=lenBinary.length;k<64;k++){
            tempStr+='0'
        }
        cStr+=tempStr
    }
 
        
    // 消息分成512比特块n个
    let _newArr=[]
    for(let i=1;i<=cStrBlocks;i++){
        let end=i*512
        let start=(i-1)*512
        let aStr=cStr.substring(start,end)

        let arr=aStr.split("").map(item=>Number(item))
        _newArr.push(arr)
    }

    // console.log('n个512比特块',_newArr);

    return _newArr
}

// 对每一个512M比特块划分为16份
function get16M(arr){
    // 传入数组为512长度
    // 数组升维二维
    let _newArr=[]

    for(let i=0;i<16;i++){
        let start=i*32
        let end=(i+1)*32

        // console.log(arr);
        // 分成4块
        let res=arr.slice(start,end)
        // console.log(res);

        let newArr=[]
        // 0-8,8-16,16-24,24-32
        // 截取到的32排序
        newArr=[].concat(res.slice(24,32),res.slice(16,24)
        ,res.slice(8,16),res.slice(0,8))
        

        // console.log('newArr',newArr);
        _newArr.push(newArr)
    }

    return _newArr
}

// 对中文字符的处理
function md5_Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
    //   console.log(c)
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
}

// 定义轮次操作
function add(B,A,res,mii,ci,lefti){

    
    
    // console.log('mii',mii);
    let mi=parseInt(mii.join(""),2)
    console.log('opt1',B);
    console.log('opt2',A);
    console.log('res',res);
    console.log('mi',mi);
    console.log('ci',ci);
    console.log('lefti',lefti);

    let temp=(A+res+mi+ci)
    console.log('temp',temp);

    // 循环左移
    temp=circle_Left(temp,lefti)
    console.log('temp left',temp);
    
    temp=(B+temp)%Math.pow(2,32)

    console.log('temp end',temp);

    return temp
}


function roundFn(type,A,B,C,D,fType,mi,ci,lefti){
    // ，参数列表，A,B,C,D，函数类型F，Mi，Ci，lefti
    // 返回值应该给谁type:'A','B','C','D'

    let Ai=A
    let Bi=B
    let Ci=C
    let Di=D

    let res=null

    // 判断该使用何种函数
    let temp=[]

    switch(fType){

        case 'F':
            temp.push(F(Bi,Ci,Di))
            temp.push(F(Ai,Bi,Ci))
            temp.push(F(Di,Ai,Bi))
            temp.push(F(Ci,Di,Ai))
            break;
        case 'G':
            temp.push(G(Bi,Ci,Di))
            temp.push(G(Ai,Bi,Ci))
            temp.push(G(Di,Ai,Bi))
            temp.push(G(Ci,Di,Ai))
            break;
        
        case 'H':
            temp.push(H(Bi,Ci,Di))
            temp.push(H(Ai,Bi,Ci))
            temp.push(H(Di,Ai,Bi))
            temp.push(H(Ci,Di,Ai))
        break;
        case 'I':
            temp.push(I(Bi,Ci,Di))
            temp.push(I(Ai,Bi,Ci))
            temp.push(I(Di,Ai,Bi))
            temp.push(I(Ci,Di,Ai))
        break;
        default:
            break;

    }

    console.log(temp);

    switch(type){

        case 'A':
            res=add(B,A,temp[0],mi,ci,lefti)
            break;
        case 'D':
            res=add(A,D,temp[1],mi,ci,lefti)
            break;
        
        case 'C':
            res=add(D,C,temp[2],mi,ci,lefti)
            break;
        case 'B':
            res=add(C,B,temp[3],mi,ci,lefti)
            break;
        default:
            break;

    }

    // console.log('res',res);

    return res
}


function addSelf(A,AA){

    let res=(A+AA)%(Math.pow(2,32))
    return res
}

function print(A){
    A=(A+Math.pow(2,32))%(Math.pow(2,32))
    A=A.toString(16)
    let str=''
    for(let i=0;i<4;i++){
        str=A.substring(i*2,(i+1)*2)+str 
    }

    return str
   
}

// 主函数处理

function mainFn(){
    

    let A=0x67452301
    let B=0xEFCDAB89
    let C=0x98BADCFE
    let D=0x10325476

    let AA=0x67452301
    let BB=0xEFCDAB89
    let CC=0x98BADCFE
    let DD=0x10325476

    // let A=0x12345678
    // let B=0x89ABCDEF
    // let C=0xFEDCBA98
    // let D=0x76543210

    // let AA=0x12345678
    // let BB=0x89ABCDEF
    // let CC=0xFEDCBA98
    // let DD=0x76543210
    // 获取循环左移数组
    let myRoundLeft=getRoundleft()

    // console.log(myRoundLeft)
    // 获取常数数组
    let cArr=generateCArr()

    // M下标数组
    let mIndexArr=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
        1,6,11,0,5,10,15,4,9,14,3,8,13,2,7,12,
        5,8,11,14,1,4,7,10,13,0,3,6,9,12,15,2,
        0,7,14,5,12,3,10,1,8,15,6,13,4,11,2,9]

    
    let message="123456"

    // utf-8编码
    message=md5_Utf8Encode(message)

    // 生成n个512M比特块
    let mArr=generateXarr(message)

    // 对于每个M比特块进行4轮操作


    let types=['A','D','C','B']
    let Fs=['F','G','H','I']
    for(let i=0;i<mArr.length;i++){
        AA=A
        BB=B
        CC=C
        DD=D

        let mrrs=get16M(mArr[i])
            // 一共64个操作
            // 分成4组，每组的F函数不同

        for(let j=0;j<64;j++){
            let res=j%4
            let type=types[res]

            let mi=mrrs[mIndexArr[j]]
            let ci=cArr[j]
            let F=Math.floor(j/16)
            let fType=Fs[F]
            let lefti=myRoundLeft[j]
            console.log(A);
            
            let result=roundFn(type,A,B,C,D,fType,mi,ci,lefti)

            // console.log(type,fType);

            switch(type){
                case 'A':
                    A=result
                break;

                case 'D':
                    D=result
                break;

                case 'C':
                    C=result
                break;

                case 'B':
                    B=result
                break;
                default:
                    break;
            }
        }

        // 将A=A+AA...
       A= addSelf(A,AA)
       B= addSelf(B,BB)
       C= addSelf(C,CC)
       D= addSelf(D,DD)

    }

    console.log(A,B,C,D);


    console.log(print(A)+print(B)+print(C)+print(D));
}


mainFn()







