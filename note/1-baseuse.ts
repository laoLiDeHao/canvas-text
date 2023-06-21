import "./style.css";

window.addEventListener("load", function () {
  const canvas: HTMLCanvasElement | null = document.getElementById(
    "canvas1"
  ) as HTMLCanvasElement;
  if (!canvas) return;
  // console.log(canvas);
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  if (!ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.strokeStyle = "Green";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const text = "hello hwo are you";
  console.log(ctx);
  ctx.strokeStyle = "orangered";
  ctx.lineWidth = 3;
  ctx.fillStyle = "white";
  ctx.font = "80px Helvetica";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic"; // 'middle'
  // ctx.letterSpacing = '10px'

  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);

  function wrapText(text: string) {
    let lineArray = [];
    let lineCouter = 0;
    let line = "";
    let words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      console.log(ctx.measureText(testLine));
      if (canvas) ctx.fillText(testLine, canvas.width / 2, canvas.height / 2);
    }
  }
});
