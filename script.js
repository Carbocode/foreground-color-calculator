function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  }

  function rgbaToHex(r, g, b, a) {
    const alpha = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    return `${rgbToHex(r, g, b)}${alpha}`;
  }

  function calculateForegroundColor(seen, back, opacity) {
    let fore = {
      r: 0,
      g: 0,
      b: 0,
    };

    fore.r = Math.round((seen.r - (1 - opacity) * back.r) / opacity);
    fore.g = Math.round((seen.g - (1 - opacity) * seen.g) / opacity);
    fore.b = Math.round((seen.b - (1 - opacity) * seen.b) / opacity);

    fore.r = Math.min(255, Math.max(0, fore.r));
    fore.g = Math.min(255, Math.max(0, fore.g));
    fore.b = Math.min(255, Math.max(0, fore.b));

    return fore;
  }

  function createTableRow(
    foreGround,
    seenColor,
    backGround,
    opacity,
    tabindex
  ) {
    const row = document.createElement("tr");

    // Colonna 1
    const infoCell = document.createElement("th");
    infoCell.tabIndex = tabindex;
    infoCell.style.verticalAlign = "top";
    infoCell.style.padding = "10px";
    infoCell.style.textAlign = "left";

    const alpha = opacity.toFixed(2);
    const hexWithAlpha = rgbaToHex(
      foreGround.r,
      foreGround.g,
      foreGround.b,
      opacity
    );

    // Column 2
    const whiteBgCell = document.createElement("td");
    whiteBgCell.style.backgroundColor = "#ffffff"; // Sfondo bianco
    whiteBgCell.style.position = "relative";
    whiteBgCell.style.width = "100px";
    whiteBgCell.style.height = "50px";

    const overlayWhite = document.createElement("div");
    overlayWhite.style.position = "absolute";
    overlayWhite.style.top = 0;
    overlayWhite.style.left = 0;
    overlayWhite.style.width = "100%";
    overlayWhite.style.height = "100%";
    overlayWhite.style.backgroundColor = `rgba(${foreGround.r}, ${foreGround.g}, ${foreGround.b}, ${opacity})`;

    whiteBgCell.appendChild(overlayWhite);
    row.appendChild(whiteBgCell);

    // Colonna 3
    const opacityText = document.createElement("div");
    opacityText.textContent = `Opacity: ${Math.round(opacity * 100)}%`;

    const hexText = document.createElement("div");
    hexText.textContent = `HEX: ${hexWithAlpha}`;

    const rgbText = document.createElement("div");
    rgbText.textContent = `RGB: rgba(${foreGround.r}, ${foreGround.g}, ${foreGround.b}, ${alpha})`;

    infoCell.appendChild(opacityText);
    infoCell.appendChild(hexText);
    infoCell.appendChild(rgbText);
    row.appendChild(infoCell);

    // Colonna 4
    const overlayCell = document.createElement("td");
    overlayCell.style.position = "relative";
    overlayCell.style.width = "100px";
    overlayCell.style.height = "50px";
    overlayCell.style.backgroundColor = `rgb(${backGround.r}, ${backGround.g}, ${backGround.b})`;

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = `rgba(${foreGround.r}, ${foreGround.g}, ${foreGround.b}, ${opacity})`;

    overlayCell.appendChild(overlay);
    row.appendChild(overlayCell);

    // Colonna 4: Colore osservato Z
    const seenColorCell = document.createElement("td");
    seenColorCell.style.backgroundColor = `rgb(${seenColor.r}, ${seenColor.g}, ${seenColor.b})`;
    seenColorCell.style.width = "100px";
    seenColorCell.style.height = "50px";
    seenColorCell.style.textAlign = "center";
    row.appendChild(seenColorCell);

    return row;
  }

  document.getElementById("calcBtn").addEventListener("click", function () {
    const backGround = {
      r: document.getElementById("backR").value,
      g: document.getElementById("backG").value,
      b: document.getElementById("backB").value,
    };
    const seenColor = {
      r: document.getElementById("seenR").value,
      g: document.getElementById("seenG").value,
      b: document.getElementById("seenB").value,
    };

    const table = document.getElementById("results");

    table.innerHTML = "";

    for (let i = 10; i <= 90; i += 5) {
      const opacity = i / 100;
      const foreGround = calculateForegroundColor(
        seenColor,
        backGround,
        opacity
      );

      const row = createTableRow(
        foreGround,
        seenColor,
        backGround,
        opacity,
        8 + i
      );
      table.appendChild(row);
    }
  });