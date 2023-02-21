
// 循环左移的的数组构造
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
    return roundLeft
}

// 常数C生成函数
function generateCArr(){
    let m=[]
    for(let i=0;i<64;i++){
        // let res=Math.floor(Math.abs(Math.sin(i+1)))*(2**32)
        let res=Math.floor( Math.abs(Math.sin(i+1))*(2**32))
        // res=''+res
        // console.log(res.toString(16));
        m.push(res.toString(16))
    }

    return m
    
}

// 将16进制字符串转换为2进制数，返回值为二进制数组
function hexToBinary(hexStr){
    let decimal=parseInt(hexStr,16)

    let binaryStr=decimal.toString(2)

    // 需要注意前补0
    let length=hexStr.length*4
    let cnt=length-binaryStr.length
    if(cnt>0){
        for(let i=0;i<cnt;i++){
            binaryStr='0'+binaryStr
        }
    }

    return binaryStr.split("").map(item=>Number(item) )
}

// 定义四种基本运算
function and(opt1,opt2){
    // 默认是数组
    let _newArr=[]
    let length=opt1.length

    for(let i=0;i<length;i++){
        let res=0
        if(opt1[i]===opt2[i]&&opt1[i]===1){
            res=1
        }

        _newArr.push(res)
    }

    return _newArr
}

// 定义四种基本运算
function or(opt1,opt2){
    // 默认是数组
    let _newArr=[]
    let length=opt1.length

    for(let i=0;i<length;i++){
        let res=1
        if(opt1[i]===opt2[i]&&opt1[i]===0){
            res=0
        }
        _newArr.push(res)
    }

    return _newArr
}

function xor(opt1,opt2){
    // 默认是数组
    let _newArr=[]
    let length=opt1.length

    for(let i=0;i<length;i++){
        let res=1
        if(opt1[i]===opt2[i]){
            res=0
        }

        _newArr.push(res)
    }

    return _newArr
}

function not(opt1){
    // 默认是数组
    let _newArr=[]
    let length=opt1.length

    for(let i=0;i<length;i++){
        let res=(i+1)%2
        _newArr.push(res)
    }

    return _newArr
}

// F函数
function F(opt1,opt2,opt3){
    let res1=and(opt1,opt2)
    let res2=and(not(opt1),opt3)
    let res3=or(res1,res2)
    return res3
}

function G(opt1,opt2,opt3){
    let res1=and(opt1,opt3)
    let res2=and(opt2,not(opt3))
    let res3=or(res1,res2)
    return res3
}

function H(opt1,opt2,opt3){
    let res1=xor(opt1,opt2)
    let res3=xor(res1,opt3)
    return res3
}

function I(opt1,opt2,opt3){
    let res1=or(opt1,not(opt3))
    let res3=xor(opt2,res1)
    return res3
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
        // console.log(code.toString(16));
        let binaryStr=hexToBinary(code.toString(16)).join("")
        cStr+=binaryStr
    }

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
    let lenBinary=hexToBinary(initLength.toString(16)).join("")

    // 判断长度是否为64为，前补0
    if(lenBinary.length<64){
        let tempStr=''
        for(let k=lenBinary.length;k<64;k++){
            tempStr+='0'
        }

        cStr+=tempStr
    }

    cStr+=lenBinary
    
        
    // 消息分成512比特块n个
    let _newArr=[]
    for(let i=1;i<=cStrBlocks;i++){
        let end=i*512
        let start=(i-1)*512
        let aStr=cStr.substring(start,end)

        let arr=aStr.split("").map(item=>Number(item))

        _newArr.push(arr)
    }

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

        let res=arr.slice(start,end)
        _newArr.push(res)
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

// console.log( hexToBinary('17689988'))

// let res=md5_Utf8Encode('123456握手')
// console.log(res);

// generateXarr('12345')

// 定义轮次操作
function add(B,A,res,mi,ci,lefti){
    B=parseInt(B,16)
    A=parseInt(A,16)
    res=parseInt(res.join(""),2)
    mi=parseInt(mi.join(""),2)
    ci=parseInt(ci,16)

    let temp=(A+res+mi+ci)

    // 需要循环左移
    // 转换为2进制
    let binaryStr=temp.toString(2)
    // 前补充0
    while(binaryStr.length<32){
        binaryStr='0'+binaryStr
    }

    // 循环左移

    // 截取前i位
    let beforeStr=binaryStr.substring(0,lefti)
    let afterStr=binaryStr.substring(lefti)

    let newStr=afterStr+beforeStr

    // 重新转换位10进制
    let temp2=parseInt(newStr,2)

    return (B+temp2).toString(16)
}

// // 定义循环左移操作 
// function roundLeft(){

// }


function roundFn(type,A,B,C,D,fType,mi,ci,lefti){
    // ，参数列表，A,B,C,D，函数类型F，Mi，Ci，lefti
    // 返回值应该给谁type:'A','B','C','D'

    // A,B,C,D需要转换位二进制数组
    let Ai=hexToBinary(A)
    let Bi=hexToBinary(B)
    let Ci=hexToBinary(C)
    let Di=hexToBinary(D)

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
            res=add(B,A,temp[3],mi,ci,lefti)
            break;
        default:
            break;

    }

    return res
}

// 主函数处理

function mainFn(){

    let A='01234567'
    let B='89ABCDEF'
    let C='FEDCBA98'
    let D='76543210'

    let AA='01234567'
    let BB='89ABCDEF'
    let CC='FEDCBA98'
    let DD='76543210'
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

    
    let message='123456我是'

    // utf-8编码
    message=md5_Utf8Encode(message)

    // 生成n个512M比特块
    let mArr=generateXarr(message)

    // 对于每个M比特块进行4轮操作


    let types=['A','D','C','B']
    let Fs=['F','G','H','I']
    for(let i=0;i<mArr.length;i++){

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
            
            let result=roundFn(type,A,B,C,D,fType,mi,ci,lefti)

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
       A= (parseInt(A,16)+parseInt(AA,16)).toString(16)
       B= (parseInt(B,16)+parseInt(BB,16)).toString(16)
       C= (parseInt(C,16)+parseInt(CC,16)).toString(16)
       D= (parseInt(D,16)+parseInt(DD,16)).toString(16)

    }
}


mainFn()







