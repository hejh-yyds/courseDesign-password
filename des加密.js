const {sBox}=require("./utils/des的8S盒子.js")
const {getChildK}=require("./01.des密钥生成")
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

const round=(L0,R0,Ki)=>{

    // L=R
    let L1=Array.from(R0)

    // e盒扩展
    let newR= eChange(R0)

    // 与k1异或
    // (前提)数组拍平
    newR=xorKR(flatArr(newR),Ki)

    // 数组重新升维
    // 分成8个6比特数组
    newR=toSixArr(newR)

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

    // p盒子置换
    newRStrArr=pChange(newRStrArr)

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


const fChange=(arr)=>{


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
    let ks=getChildK()

    // for 循环16轮
    
    for(let i=0;i<16;i++){
        let res=round(L,R,ks[i])

        L=res.L1
        R=res.R1
    }

    // 合并L，R
    let RL=R.concat(L)

    
    // 进行初始逆置换
    return reservePChange(RL)    
}

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

const flatArr=(arr)=>{

    let newArr=[]

    arr.forEach(item=>{
        newArr=[...newArr,...item]
    })

    return newArr
}

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

function hexToBinary(value){
    let len=value.length*4
    let value10=parseInt(value,16)
    let value2=value10.toString(2)
    // 前补充0
    while(value2.length<len){
        value2='0'+value2
    }
    let initarr=value2.split("")

    return initarr
}
// console.log(sBox);




// 明文长度64位
let m='0123456789ABCDEF'
let initarr=hexToBinary(m)
let newArr=initPChange(initarr)
let result=fChange(newArr)


console.log(parseInt(result.join(""),2).toString(16));


console.log(111);
