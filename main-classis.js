import './style.css'

window.addEventListener('load', render)


function render() {
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;




  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect
      this.x = 0
      this.y = Math.random() * this.effect.canvasHeight
      this.color = color
      this.originX = x
      this.originY = y
      this.size = this.effect.gap;
      this.dx = 0
      this.dy = 0
      this.vx = 0
      this.vy = 0
      this.force = 0
      this.angle = 0
      this.distance = 0
      this.friction = Math.random() * 0.6 + 0.15
      this.ease = Math.random() * 0.1 + 0.005;
      this.linkmouse = Math.random()
    }
    draw() {
      if (this.effect.mouse.active&&this.linkmouse<0.2) {
        let gradient1 = this.effect.context.createLinearGradient(0, 0, this.effect.canvasWidth, this.effect.canvasHeight);
        gradient1.addColorStop(0.3, 'red')
        gradient1.addColorStop(0.5, 'fuchsia')
        gradient1.addColorStop(0.7, 'purple')

        this.effect.context.strokeStyle = gradient1;
        this.effect.context.lineWidth = 0.1
        this.effect.context.beginPath();
        this.effect.context.moveTo(this.x, this.y);
        this.effect.context.lineTo(this.effect.mouse.x, this.effect.mouse.y);
        this.effect.context.stroke();
      }
      this.effect.context.fillStyle = this.color
      this.effect.context.fillRect(this.x, this.y, this.size, this.size)
    }
    update() {
      if (this.effect.mouse.active) {
        // mouse hover
        this.dx = this.effect.mouse.x - this.x
        this.dy = this.effect.mouse.y - this.y
        this.distance = Math.pow(Math.hypot(this.dx, this.dy), 2) // \sqrt{v_1^2 + v_2^2 + \dots + v_n^2}
        this.force = -this.effect.mouse.radius / this.distance
        if (this.distance < this.effect.mouse.radius) {
          this.angle = Math.atan2(this.dy, this.dx)
          this.vx += this.force * Math.cos(this.angle)
          this.vy += this.force * Math.sin(this.angle)
        }

      }

      // let paritcles from any  position to right position
      // and this.xy is random inited
      this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease

    }
  }


  class Effect {
    constructor(context, canvasWidth, canvasHeight) {
      this.context = context
      this.canvasHeight = canvasHeight
      this.canvasWidth = canvasWidth
      this.textX = this.canvasWidth / 2
      this.textY = this.canvasHeight / 2
      this.fontSize = 100
      this.lineHeight = this.fontSize
      this.maxTextWidth = this.canvasWidth * .8
      this.textInput = document.getElementById('textInput')
      this.textInput.addEventListener('keyup', (e) => {
        if (e.key === " ") return
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.warpText(e.target.value)
      })

      // particle text
      this.particles = []
      this.gap = 2
      this.mouse = {
        active: false,
        radius: 20000,
        x: 0,
        y: 0
      }

      window.addEventListener('mousemove', (e) => {
        // capture mouse position 
        this.mouse.x = e.x
        this.mouse.y = e.y
      })
      window.addEventListener('mouseover', () => {
        this.mouse.active = true
      })
      window.addEventListener('mouseout', () => {
        this.mouse.active = false
      })
    }
    draw() {

    }
    warpText(text) {

      // canvas setting here
      const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
      gradient.addColorStop(0.3, 'red')
      gradient.addColorStop(0.5, 'fuchsia')
      gradient.addColorStop(0.7, 'purple')
      this.context.fillStyle = gradient
      this.context.textAlign = 'center'
      this.context.textBaseline = 'middle'


      this.context.lineWidth = 3 //rgba(s0,s1,s2,s3)
      this.context.strokeStyle = 'white'
      this.context.font = `${this.fontSize}px Helvetica`



      let lineArray = [];
      let lineCouter = 0;
      let line = ' ';
      let words = text.split(' ')
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';

        // 换行
        if (this.context.measureText(testLine).width > this.maxTextWidth) {
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



      let textHeight = this.lineHeight * lineCouter
      let textY = this.canvasHeight / 2 - textHeight / 2
      lineArray.forEach((el, index) => {
        this.context.fillText(el, this.textX, textY + (index * this.lineHeight))
        // this.context.strokeText(el, this.textX, textY + (index * this.lineHeight))
      })
      this.convertToParticles()
    }

    convertToParticles() {
      this.particles = [];

      const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[index + 3] //rgba(0,0,0,alpha)
          if (alpha > 0) {
            const red = pixels[index]
            const green = pixels[index + 1]
            const blue = pixels[index + 2]
            const color = `rgb(${red},${green},${blue})`
            this.particles.push(new Particle(this, x, y, color))
          }
        }
      }

    }
    render() {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.particles.forEach(particle => {
        particle.update()
        particle.draw()

      })
    }

    resize(width, height) {
      this.canvasHeight = height
      this.canvasWidth = width
      this.textX = this.canvasWidth / 2
      this.textY = this.canvasHeight / 2
      this.maxTextWidth = this.canvasWidth * .8
    }
  }

  const effect = new Effect(ctx, canvas.width, canvas.height)
  effect.warpText(effect.textInput.value)
  effect.render()


  function animate() {
    effect.render()
    requestAnimationFrame(animate)
  }

  animate()
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    effect.warpText(effect.textInput.value)
    effect.resize(canvas.width, canvas.height)
  })

}