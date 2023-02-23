

// return "".join([str((n >> y) & 1) for y in range(count-1, -1, -1)])


function conver(n,length){
    let _newArr=[]
    for(let i=0;i<length;i++){

        let str=new String((n>>i)&1) 
        _newArr.push(str)
    }

    console.log(_newArr);
}

let res=conver(15,8)

console.log(res);


let str='0111'

console.log(parseInt(str,16));