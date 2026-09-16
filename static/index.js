const base=document.querySelector('.base')
const middle=document.querySelector('.middle')
const high=document.querySelector('.high')
const contentBox=document.querySelector('.content-box')
const center=document.querySelector('.center')
const t=document.querySelector('.top-right>span')
const topBtn=document.querySelector('.top-btn')
const Num=document.querySelector('.top-left>span')
const stop=document.querySelector('.stop')
const btn=document.querySelector('button')
const blocks = document.getElementsByClassName('block');

// 变量
let num=40
let baseVolume=81
let baseSide=Math.sqrt(baseVolume)
let middleVolume=256
let middleSide=Math.sqrt(middleVolume)
let highVolume=625
let highSide=Math.sqrt(highVolume)
let flag=true

// 初始化       现有数据才有结构
const squire=[]
random(num,middleSide)
function random(num,side){
    for (let i=0;i<side;i++){
        squire[i]=[]
        for (let j=0;j<side;j++){
            squire[i][j]={value:0,status:0,open:false}
        }
    }
    // 随机雷
    for (let i=0;i<num; ){
        const row=parseInt(Math.random()*side)
        const col=parseInt(Math.random()*side)
        if(squire[row][col].value != -1){
            squire[row][col].value = -1
            i++
        }
    }
    // 为每个block调用计算炸弹的函数
    for(let i=0;i<side;i++){
        for(let j=0;j<side;j++){
            if(squire[i][j].value !==-1){
                squire[i][j].value=count(i,j,side)
            }
        }
    }
    // 渲染block
    for(let i=0;i<side;i++){
        for(let j=0;j<side;j++){
            const div=document.createElement('div');
            div.classList.add('block')
            div.dataset.row=i;
            div.dataset.col=j;
            div.addEventListener('click',(e)=>{
                squire[i][j].open=true
                console.log(squire[i][j])
                let val=squire[i][j].value
                e.target.innerHTML=val==-1?'💣':val
                console.log(e.target)
                e.target.style.backgroundColor='#fff'
                if(squire[i][j].value==-1){
                    e.target.classList.add('boom')
                }
                if(squire[i][j].value==0){
                    e.target.innerHTML='';
                    revealCell(i,j,side)
                }

            })
            // 右键
            div.oncontextmenu=(e)=>{
                e.preventDefault()
                let nowRow=e.target.dataset.row;
                let nowCol=e.target.dataset.col;
                squire[nowRow][nowCol].status++
                console.log(squire[nowRow][nowCol].status)
                if(squire[nowRow][nowCol].status==1){
                    e.target.innerHTML='🚩'
                }else if(squire[nowRow][nowCol].status==2){
                    e.target.innerHTML='❓'
                }else{
                    e.target.innerHTML=''
                    squire[nowRow][nowCol].status=0
                }
            }
            contentBox.appendChild(div)
        }
    }
}
// 递归 逻辑
// 当点击的元素innerhtml==0时 计算递归
// 碰到status!==0，innerhtml!==0,open==true时递归停止
function revealCell(row, col, side) {
    if (row < 0 || col < 0 || row >= side || col >= side) {
        return;
    }
    if (squire[row][col].status!==0)
    {
        return;
    }
    if(squire[row][col].value==0) {
        squire[row][col].open=true;
        const selector = `[data-row="${row}"][data-col="${col}"]`;
        const element = document.querySelector(selector);
        element.style.backgroundColor='#fff'
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                // 检查是否越界
                if (r < 0 || c < 0 || r >= side || c >= side) {
                    continue;
                }
                if (squire[r][c].status !== 0) {
                    continue;
                }
                if (squire[r][c].open === true) {
                    continue;
                }
                // 跳过自己
                if (r === row && c === col) continue;
                // 递归打开周围单元格
                // console.log('递归----')


                revealCell(r, c, side);

            }
        }
    }
}
// 计算数字
// 将目标格子的附近坐标存到一个数组内【r,c】
// 将每个需要判断的坐标放到一个数组内【【r,c】.[r,c],[r,c】
// 将将坐标小于0，或者大于side数的
function count(row,col,side) {
    const tempArr=[]
    let count=0
    tempArr.push([row - 1, col - 1])
    tempArr.push([row - 1, col])
    tempArr.push([row - 1, col + 1])
    tempArr.push([row, col - 1])
    tempArr.push([row, col + 1])
    tempArr.push([row + 1, col - 1])
    tempArr.push([row + 1, col])
    tempArr.push([row + 1, col + 1])
    tempArr.forEach((item)=>{
        const [r,c]=item
        if(r<0||c<0||c>=side||r>=side){
            return;
        }
        if(squire[r][c].value==-1){
            count++;
        }
    })
    return count
}
// 初级 中级 高级 区域变动
base.addEventListener('click',()=>{
    center.style.width='262px'
    center.style.height='316px'
    contentBox.style.width='227.25px'
    contentBox.style.height='227.25px'
    contentBox.innerHTML=''
    num=10
    Num.innerHTML=num
    random(num,baseSide)
})
middle.addEventListener('click',()=>{
    center.style.width='442px'
    center.style.height='492px'
    contentBox.style.width='404px'
    contentBox.style.height='404px'
    contentBox.innerHTML=''
    num=40
    Num.innerHTML=num
    random(num,middleSide)
})
// 176.75
high.addEventListener('click',()=>{
    center.style.width='669.25px'
    center.style.height='719.25px'
    contentBox.style.width='631.25px'
    contentBox.style.height='631.25px'
    contentBox.innerHTML=''
    num=99
    Num.innerHTML=num
    random(num,highSide)
})
// 开启倒计时
contentBox.addEventListener('click',(e)=>{
    if(flag){
        flag=false
        time()
    }
    if(e.target.classList.contains('boom')){
        stop.style.display='block'
        clearInterval(timer)
        flag=true
    }
})
topBtn.addEventListener('click',()=>{
    contentBox.innerHTML=''
    random(num,middleSide)
    clearInterval(timer)
    t.innerHTML='000'
})
btn.addEventListener('click',()=>{
    stop.style.display='none'
    contentBox.innerHTML=''
    random(num,middleSide)
    t.innerHTML='000'
})
// 计时器
function time() {
    let i=0
    return timer=setInterval(()=>{
        i++
        t.innerHTML=i
    },1000)
}


