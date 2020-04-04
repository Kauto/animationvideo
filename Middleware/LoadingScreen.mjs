export default class LoadingScreen {
  enabled = true;
  loading({ output, progress }) {
    const ctx = output.context[0];
    const loadedHeight =
      typeof progress === "number"
        ? Math.max(1, progress * output.height)
        : output.height;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.width, output.height);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(
      0,
      output.height / 2 - loadedHeight / 2,
      output.width,
      loadedHeight
    );
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    ctx.fillText(
      isNaN(parseFloat(progress))
        ? progress
        : "Loading " + Math.round(100 * progress) + "%",
      10 + Math.random() * 3,
      output.height - 10 + Math.random() * 3
    );
  }
}
