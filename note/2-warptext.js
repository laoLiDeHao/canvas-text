import './style.css'

window.addEventListener('load', render)
window.addEventListener('resize', render)

function render() {
  const textInput = document.getElementById('textInput')
  const canvas = document.getElementById('canvas1')
  // console.log(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.strokeStyle = 'blue'
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();


  ctx.strokeStyle = 'Green'
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();


  /**
   * 渐变色Gradient
   */
  const lineHeight = 80
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  // const gradient = ctx.createRadialGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0.3, 'red')
  gradient.addColorStop(0.5, 'blue')
  gradient.addColorStop(0.7, 'yellow')
  ctx.fillStyle = gradient
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 30
  ctx.font = `${lineHeight}px Helvetica`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle' //'alphabetic' // 'middle'

  const maxTextWidth = canvas.width

  function wrapText(text) {

    let lineArray = [];
    let lineCouter = 0;
    let line = ' ';
    let words = text.split(' ')
    console.log(words);
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      // console.log(ctx.measureText(testLine).width); //获取这段字符的x方向尺寸

      // 换行
      if (ctx.measureText(testLine).width > maxTextWidth) {
        line = words[i] + ' '
        lineCouter++;
      } else if (words[i] === '&/n') {
        line = ''
        lineCouter++;
      } else {
        line = testLine
      }


      // 写入
      lineArray[lineCouter] = line
    }


    let textHeight = lineHeight * lineCouter
    let textY = canvas.height / 2 - textHeight / 2
    lineArray.forEach((el, index) => {
      console.log(el);
      ctx.fillText(el, canvas.width / 2, textY + index * 70)
    })

    console.log(lineArray);
  }

  // wrapText('this function will help you type multiline centered text &/n :}}')
  textInput.addEventListener('keyup', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    wrapText(e.target.value)
  })




}