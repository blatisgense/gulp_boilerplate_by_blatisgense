import a from './import.js'

console.log(a);

let i = await ff();
console.log(await i);

async function ff(){
    setTimeout(()=>{
        return 12;
    }, 10000)
}




