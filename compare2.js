function compare(arr1,arr2){
    let str1=arr1.join("")
    let str2=arr2.join("")

    console.log(str1===str2);

}

function flatter(array) {
    return array.reduce(function(prev, current) {
        return prev.concat(Array.isArray(current) ? flatter(current) : current)
    }, [])
}


// f后 [0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]


let arr1= ['0', '1', '1', '1', '0', '0', '1', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '0', '1', '0', '1', '0', '1', '1', '0', '1', '1', '1', '1', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '0', '1', '0']



// f后 
let arr2= ['0', '1', '1', '1', '0', '0', '1', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '0', '1', '0', '1', '0', '1', '1', '0', '1', '1', '1', '1', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '0', '1', '0']




console.log('a',parseInt(arr1.join(""),2).toString(16));
console.log('b',parseInt(arr2.join(""),2).toString(16));