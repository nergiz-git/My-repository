const leftbutton = document.querySelectorAll('.left  li');
const rightbutton = document.querySelectorAll('.right  li');
const leftinput = document.querySelector('.left input');
const rightinput = document.querySelector('.right input');
const buttons = document.querySelectorAll('li')
const leftp = document.querySelector('.left>.value p')
const rightp = document.querySelector('.right>.value p')
let query = 'RUB';
let query2 = 'USD';
console.log(window.navigator.onLine)
const calc = function (n) {
    const leftactiveli = document.querySelector('.left  .activeli')
    const rightactiveli = document.querySelector('.right  .activeli')
    if(leftactiveli.textContent!==rightactiveli.textContent){
    fetch('https://v6.exchangerate-api.com/v6/b6f2c54d6929bc5cb0d0b059/latest/USD')
        .then(r => r.json()).then(data => {
           let num = data.conversion_rates[leftactiveli.textContent]
           let num1 = data.conversion_rates[rightactiveli.textContent]
            rightinput.value = ((n * num1) / num).toFixed(4);
            leftp.textContent = `1${leftactiveli.textContent} = ${((1 * num1) / num).toFixed(4)} 
             ${rightactiveli.textContent} `;
            rightp.textContent = `1${rightactiveli.textContent} = ${((1 * num) / num1).toFixed(4)} 
             ${leftactiveli.textContent} `;
        })
    }else{
        rightinput.value =n.toFixed(4);
        leftp.textContent=`1${leftactiveli.textContent} =1${leftactiveli.textContent}`
        rightp.textContent=`1${leftactiveli.textContent} =1${leftactiveli.textContent}`
    }
}
leftbutton.forEach(item => {
    item.addEventListener('click', function active() {
        if(window.navigator.onLine){
            let activeli = document.querySelector('.left  .activeli')
            activeli.classList.remove('activeli')
            item.classList.add('activeli')
            if (query !== document.querySelector('.left  .activeli').textContent ) {
                query = document.querySelector('.left  .activeli').textContent
                calc(+(leftinput.value));
            }
            }else{
                const of= document.querySelector('.ofline img')
document.querySelector('main').style.display='none'
document.querySelector('header').style.display='none'
of.style.display ="block"
            }
    })
});


rightbutton.forEach(item => {
    item.addEventListener('click', function active() {
        if(window.navigator.onLine){
            const activeli = document.querySelector('.right .activeli')
            activeli.classList.remove('activeli')
            item.classList.add('activeli')
            if (query2 !== document.querySelector('.right .activeli').textContent ) {
                query2 = document.querySelector('.right .activeli').textContent
                calc(+(leftinput.value));
            }
            }else{
                const of= document.querySelector('.ofline img')
document.querySelector('main').style.display='none'
document.querySelector('header').style.display='none'
of.style.display ="block"
            }
    })
});
leftinput.addEventListener('input', () => {
    if(window.navigator.onLine){
    calc(+(leftinput.value));
    }else{
const of= document.querySelector('.ofline img')
document.querySelector('main').style.display='none'
document.querySelector('header').style.display='none'
of.style.display ="block"
    }
})