
export function random(len:number){

    const randomString="qweerit9orpjajdhbgncmnvbcbva09487425177";
    const randomStringLength=randomString.length;
    let ans="";
    for(let i=0;i<len;i++){
        ans+=randomString[Math.floor((Math.random() * randomStringLength))]
    }
    return ans;
}