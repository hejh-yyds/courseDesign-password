

// gcd函数
function gcd( n,  m) {
    let r, temp;
    if (n < m) {
        temp = n;
        n = m;
        m = temp;
    }
    while (m != 0) {
        r = n % m;
        n = m;
        m = r;
    }
    return n;
}


function mainFn(z,c) {

    let logArr=[]
    // c=(a+bx)mod28
    // z=a的逆(c-b)mod28
    let Z = z
    let C = c
    let res;

    let clen = C.length;
    let p, a,b;

    let pos=[]

    // 查找 C 在 Z 中的位置(数字密文)
    for (let i = 0; i < clen; i++) {
        pos.push(Z.indexOf(C[i]))
    }

    // 爆破 a
    for (a = 2; a < 28; a++) {
        
        // 判断 a 是否可逆
        if (gcd(a, 28) == 1) {
            
            // 求出 a 的逆元 p
            for (b = 2; b < 28; b++) {
                if ((a * b) % 28 === 1){
                    p=b
                    break;
                } 
            }

            // 爆破 b
            for (b = 0; b < 28; b++) {
                res=''
               
                pos.forEach(item=>{
                    item=(p*(item-b))
                    while(item<0){
                        item+=28
                    }
                    item=item%28
                    res+=Z[item]
                })

                logArr.push(`当 a=${a},b=${b} 时，解密结果为：${res}`)
            }
        }
    }

    return logArr
}


// mainFn()

// export default {
//     fsmm:mainFn
// }

export const fsmm=mainFn
