import {sBox} from "./utils/des8S.js"
import {getChildK} from "./desKGenarate.js"

// 初始IP置换
const  initPChange=(arr)=>{

    let initArr=[
        58,50,42,34,26,18,10,2,
        60,52,44,36,28,20,12,4,
        62,54,46,38,30,22,14,6,
        64,56,48,40,32,24,16,8,
        57,49,41,33,25,17,9,1,
        59,51,43,35,27,19,11,3,
        61,53,45,37,29,21,13,5,
        63,55,47,39,31,23,15,7
    ]

    let newArr=[]

    for(let i=0;i<64;i++){
        newArr.push(arr[initArr[i]-1])
    }

    return newArr
}

// IP逆置换
const  reservePChange=(arr)=>{

    let initArr=[
        40,8,48,16,56,24,64,32,
        39,7,47,15,55,23,63,31,
        38,6,46,14,54,22,62,30,
        37,5,45,13,53,21,61,29,
        36,4,44,12,52,20,60,28,
        35,3,43,11,51,19,59,27,
        34,2,42,10,50,18,58,26,
        33,1,41,9,49,17,57,25
    ]

    let newArr=[]

    for(let i=0;i<64;i++){
        newArr.push(arr[initArr[i]-1])
    }

    return newArr
}

// 轮函数
const round=(L0,R0,Ki)=>{

    // L=R
    let L1=Array.from(R0)

    // e盒扩展
    let newR= eChange(R0)

    console.log('flat后的E盒',flatArr(newR));

    // 与k1异或
    // (前提)数组拍平
    newR=xorKR(flatArr(newR),Ki)

    console.log('与KI异或 ',newR);

    // 数组重新升维
    // 分成8个6比特数组
    newR=toSixArr(newR)
    console.log('升维的KI异或 ',newR);

    // s盒压缩
    let RStr="";

    // 循环8次
    newR.forEach((item,index)=>{
        // 确定行和列
        let row=item[0]*2+item[5]*1
        let col=item[1]*8+item[2]*4+item[3]*2+item[4]*1

        // console.log(row,col);
        // si盒
        let s=sBox[index]

        // 替换表（10进制）
        let value=s[row][col]

        console.log('10进制对于的s盒数:',value);

        // 转2进制
        let value2=value.toString(2)

        // 前补充0
        if(value2.length<4){

            let l=value2.length;
            let rest=4-l

            let bStr=""
            for(let j=0;j<rest;j++){
                bStr+='0'
            }

            value2=bStr+value2
        }

        RStr+=value2
    })

    // 压缩后的32比特数组
    let newRStrArr=RStr.split("")

    console.log('S盒压缩 ',newRStrArr);

    // p盒子置换
    newRStrArr=pChange(newRStrArr)
    console.log('P盒置换 ',newRStrArr);

    // 与L异或
    let R1=xorLF(L0,newRStrArr)

    // console.log(RStr);

    // console.log(L1,parseInt(L1.join(""),2).toString(16),'l1');
    // console.log(R1,parseInt(R1.join(""),2).toString(16),'r1');

    return {
        L1:L1,
        R1:R1
    }
}


// （加密）轮函数+逆初始IP
const fChange=(arr,k)=>{

    // 左右部分分离
    let L=[]
    let R=[]

    arr.forEach((item,index)=>{
        if(index>=32){
            R.push(item)
        }else{
            L.push(item)
        }
    })

    // 这里为k子密钥
    // let k1=[
    //     '1', '1', '1', '0', '0', '1', '0', '0',
    //     '1', '1', '1', '1', '1', '1', '0', '1',
    //     '1', '0', '0', '1', '1', '0', '0', '0',
    //     '0', '1', '1', '0', '0', '1', '0', '0',
    //     '1', '0', '1', '1', '0', '1', '1', '0',
    //     '0', '1', '0', '1', '1', '0', '0', '0'
    // ]

    // 获取子密钥数组
    let ks=getChildK(k)

    // for 循环16轮
    
    for(let i=0;i<16;i++){
        console.log('Li',parseInt(L.join(""),2).toString(16));
        console.log('Ri',parseInt(R.join(""),2).toString(16));
        console.log('Ki',parseInt(ks[i].join(""),2).toString(16));
        console.log('------------------------------');
        let res=round(L,R,ks[i])

        L=res.L1
        R=res.R1
    }

    // 合并L，R
    let RL=R.concat(L)


    console.log('RL ',RL);
    
    // 进行初始逆置换

    let resverRL=reservePChange(RL)
    console.log('RL end',resverRL);
    return resverRL
}

// (解密) 轮函数+逆初始IP
const fChange2=(arr,k)=>{

    // 左右部分分离
    let L=[]
    let R=[]

    arr.forEach((item,index)=>{
        if(index>=32){
            R.push(item)
        }else{
            L.push(item)
        }
    })


    // 这里为k子密钥
    // let k1=[
    //     '1', '1', '1', '0', '0', '1', '0', '0',
    //     '1', '1', '1', '1', '1', '1', '0', '1',
    //     '1', '0', '0', '1', '1', '0', '0', '0',
    //     '0', '1', '1', '0', '0', '1', '0', '0',
    //     '1', '0', '1', '1', '0', '1', '1', '0',
    //     '0', '1', '0', '1', '1', '0', '0', '0'
    // ]

    // 获取子密钥数组
    let ks=getChildK(k)

    // for 循环16轮
    
    for(let i=15;i>=0;i--){
        let res=round(L,R,ks[i])

        L=res.L1
        R=res.R1
    }

    // 合并L，R
    let RL=R.concat(L)

    
    // 进行初始逆置换
    return reservePChange(RL)    
}

// e盒扩展
const eChange=(arr)=>{

    // 32位扩展成48位
    // 32分成8组
    let res=[]

    let twoArr=new Array(8)
    for(let i=0;i<8;i++){
        twoArr[i]=[]
    }

    let cnt=0;

    // 32位一维数组升维8行*4列
    arr.forEach(item=>{
        let rest=Math.floor(cnt/4)
        twoArr[rest].push(item)
        cnt++;
    })

    // 对这8行
    for(let i=0;i<8;i++){
        
        // 寻找上一行和下一行
        let before=i-1;
        let after=i+1;

        if(before<0){
            before=7
        }

        if(after>7){
            after=0
        }

        let tempArr=Array.from(twoArr[i])
        // 前补充前一行的最后一个
        tempArr.unshift(twoArr[before][3])
        // 后补下一行的第一个
        tempArr.push(twoArr[after][0])

        res.push(tempArr)
    }


    return res

}

// p盒置换
const pChange=(arr)=>{
    let pArr=[16,7,20,21,
        29,12,28,17,
        1,15,23,26,
        5,18,31,10,
        2,8,24,14,
        32,27,3,9,
        19,13,30,6,
        22,11,4,25
    ]

    let newArr=[]

    for(let i=0;i<32;i++){
        newArr.push(arr[pArr[i]-1])
    }

    return newArr
}

// k与r异或
const xorKR=(R,K)=>{

    let newArr=[]

    for(let i=0;i<48;i++){

        if(R[i]===K[i]){
            newArr.push('0')
        }else{
            newArr.push('1')
        }
    }

    return newArr
}

// k与r异或
const xorLF=(L,F)=>{

    let newArr=[]

    for(let i=0;i<32;i++){

        if(L[i]===F[i]){
            newArr.push('0')
        }else{
            newArr.push('1')
        }
    }

    return newArr
}

// 数组降维
const flatArr=(arr)=>{

    let newArr=[]

    arr.forEach(item=>{
        newArr=[...newArr,...item]
    })

    return newArr
}

// 数组升维
const toSixArr=(arr)=>{

    // 48位的一维数组--->8行6列
    let newArr=new Array(8)

    for(let i=0;i<8;i++){
        newArr[i]=[]
    }

    arr.forEach((item,index)=>{
        let rest=Math.floor(index/6)
        newArr[rest].push(item)
    })

    return newArr
}

// 16进制字符串--->2进制数组
function hexToBinary(value){
    // 16进制字符串转换位2进制字符串
    let binaryStr=''
    let len=value.length*4

    for(let i=0;i<value.length;i++){
        let str=value.substring(i,i+1)
        let value10=parseInt(str,16)
        let value2=value10.toString(2)
        while(value2.length<4){
            value2='0'+value2
        }
        binaryStr+=value2
    }
    
    
    // 前补充0
    
    let initarr=binaryStr.split("")

    return initarr
}
// console.log(sBox);

// 对中文字符的处理
function utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
    //   console.log(c)
    //   if (c < 128) {
    //     utftext += String.fromCharCode(c);
    //   } else if ((c > 127) && (c < 2048)) {
    //     utftext += String.fromCharCode((c >> 6) | 192);
    //     utftext += String.fromCharCode((c & 63) | 128);
    //   } else {
    //     utftext += String.fromCharCode((c >> 12) | 224);
    //     utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    //     utftext += String.fromCharCode((c & 63) | 128);
    //   }

        utftext += String.fromCharCode(c);
    }
    return utftext;
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

// 把明文到64bit
function to64Bit(message){
    let cStr=''
    // 消息的每一个字符转换为ascall码再转换为二进制数
    for(let i=0;i<message.length;i++){
        let code=message.charCodeAt(i)
        // TODO
        // let binaryStr=intTobin(code,8)
        let binaryStr=intTobin(code,16)
        cStr+=binaryStr
    }

    let _newArr=cStr.split("")
    return _newArr
}

// 二进制数组转16进制字符串
function binToHex(binArr){
    console.log('binArr',binArr);
    
    let res=''
    for(let i=0;i<binArr.length;i+=4){
        let str=''+binArr.slice(i,i+4).join("")

        let hexStr=parseInt(str,2).toString(16)

        res+=hexStr
    }

    return res
}

// 加密主函数
function mainFn(m,k){
    // 明文长度64位(8字节)
    // let m='12345678'

    let type=4

    let res=''
    let m1=m
    let code=type-(m1.length%type)
    code=''+code
    while(m1.length%type!==0){
        m1+=code
    }

    for(let i=0;i<m1.length;i+=type){

        let m=m1.substring(i,i+type)
        m=utf8Encode(m)
        // 转换为ascall码 8位存储
    
        // let initarr=hexToBinary(m)
        let initarr=to64Bit(m)
        console.log('init arr',initarr);
        let newArr=initPChange(initarr)
        console.log('change1 arr',m);
        let result=fChange(newArr,k)

        console.log(result);
        // console.log(parseInt(result.join(""),2).toString(16));

        console.log(binToHex(result));
        res+=binToHex(result)
    }

    // 一大串的16进制串

    
    return res
}

// 获取ascall码对应的字符
function getAsc(arr){

    let type=16
    let res=''
    for(let i=0;i<arr.length;i+=type){
        let str= String.fromCharCode(parseInt( arr.slice(i,i+type).join(""),2))
        console.log('ascall',str);
        res+=str
    }

    return res
}

// 解密主函数
function DCode(c,k){
    // 明文长度64位(8字节)
    // let m='12345678'
    // m=utf8Encode(m)
    // 转换为ascall码 8位存储

    
    // let initarr=hexToBinary(m)
    // let initarr=to64Bit(m)

    let res=''

    let c1=c

    for(let i=0;i<c1.length;i+=16){
        let c=c1.substring(i,i+16)
        console.log('des解密');
        // console.log('init arr',initarr);
        let initarr=hexToBinary(c)
        let newArr=initPChange(initarr)
        // console.log('change1 arr',m);
        let result=fChange2(newArr,k)

        console.log(binToHex(result));

        // 对64位的比特，8位一组，求acass码
        console.log(getAsc(result));

        // return getAsc(result)
        // console.log(parseInt(result.join(""),2).toString(16));

        res+=getAsc(result)
    }

    // 
    return res
    
}

// mainFn("BAAAAAAA","AAAAAAAB")


// DCode()

export const desEncode= mainFn
export const desDecode= DCode

// export default{
//     desEncode:mainFn,
//     desDecode:DCode
// }