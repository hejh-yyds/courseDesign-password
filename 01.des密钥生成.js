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

function processPchange1(initalArr){

    let pChange1=
    [
        57,49,41,33,25,17,9,
        1,58,50,42,34,26,18,
        10,2,59,51,43,35,27,
        19,11,3,60,52,44,36,
        63,55,47,39,31,23,15,
        7,62,54,46,38,30,22,
        14,6,61,53,45,37,29,
        21,13,5,28,20,12,4
    ]

    let newArr=new Array(56).fill(0)

    
    for(let i=0;i<56;i++){
        newArr[i]=initalArr[pChange1[i]-1]
    }

    return newArr
}


function processPchange2(initalArr){

    // 结果
    let res=[]

    // ci左半部分
    let cArr=[]

    // di右半部分
    let dArr=[]


    // initalArr为进行置换选择1的56位数组
    // 左右分离
    initalArr.forEach((item,index)=>{
        if(index>=28){
            dArr.push(item)
        }else{
            cArr.push(item)
        }
    })


    let circleArr=[1,1,2,2,
        2,2,2,2,
        1,2,2,2,
        2,2,2,1
    ]

    // 循环16圈

    for(let i=1;i<=16;i++){

        // 循环左移i位
        cArr=circleChange(cArr,circleArr[i-1])
        dArr=circleChange(dArr,circleArr[i-1])


        // 合并56位
        let newArr=cArr.concat(dArr)

        // 置换选择2压缩48位
        let resArr=processChange3(newArr)

        // 存储k1-k16子密钥
        res.push(resArr)

    }


    console.log(res);

    // 将k1-k2个子密钥从2--->16进制
    let strArr=[]
    res.forEach(item=>{
        let s=item.join("")
        let val=parseInt(s,2)
        let newStr=val.toString(16)
        strArr.push(newStr)
    })

    // 存储16进制的字符串数组
    console.log(strArr);


    // console.log(res[0]);

    return res

}


function processChange3(initalArr){

    // 置换选择2

    let pchangeArr=[
        14,17,11,24,1,5,
        3,28,15,6,21,10,
        23,19,12,4,26,8,
        16,7,27,20,13,2,
        41,52,31,37,47,55,
        30,40,51,45,33,48,
        44,49,39,56,34,53,
        46,42,50,36,29,32
    ]

    let newArr=[]

    for(let i=0;i<48;i++){
        newArr.push(initalArr[pchangeArr[i]-1])
    }

    return newArr

}


function circleChange(arr,length){

    for(let i=0;i<length;i++){
        let temp=arr[0]
        for(let j=0;j<arr.length-1;j++){

            arr[j]=arr[j+1]
        }
        arr[arr.length-1]=temp
    }

    return arr

}



module.exports={

    getChildK:function(value="FEDCBA9876543210"){
        // 初始密钥
        // let value="FEDCBA9876543210"
        let initalArr=hexToBinary(value)
    
        // 置换选择1
        let resArr1= processPchange1(initalArr)
    
        // 轮函数
        return processPchange2(resArr1)
    }
}

