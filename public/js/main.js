async function initGallery() {
  const galleryImages = await fetch("../gallery/list.json").then((r) =>
    r.json()
  );

  // console.log(JSON.stringify(galleryImages, null, 2));

  const flicking = new Flicking("#flick.gallery", {
    // renderOnlyVisible: true,
    resizeOnContentsReady: true,
    align: "center",
  });

  const galleryBody = galleryImages.map((img) => {
    const desc = [img.title, img.description].filter(Boolean).join(' -- ')
    return `<div class="flicking-panel">
    <img loading="lazy" alt="${desc}" title="${desc}" src=".${img.image}" draggable="false" ondragstart="return false;">
    </div>`;
  });

  function clickShowGallery() {
    flicking.append(galleryBody);
    document
      .querySelectorAll(".flicking-panel img")
      .forEach((i) => (i.onload = flicking.resize));
    document.querySelector("button.gallery-show").style.display = "none";
    document.querySelector("p.gallery-instructions").style.display = "block";
  }

  document.querySelector("main section.gallery button").onclick =
    clickShowGallery;
}
initGallery();

async function initAccessories() {
  const imgs = await (
    await fetch("../accessories/index.txt").then((r) => r.text())
  )
    .split("\n")
    .filter(Boolean);

  const groups = imgs.reduce((_groups, src) => {
    const group = src.split("-")[0];
    if (!_groups[group]) {
      _groups[group] = [];
    }
    _groups[group].push(src);
    return _groups;
  }, {});

  document
    .querySelectorAll("section.accessories > div > h2")
    .forEach((header) => {
      const group = header.className;
      // console.log({ group, groups });
      const div = groups[group].map((src) => {
        return `<a href="./accessories/${src}" target="_blank">
          <img loading="lazy" class="accessory" src="./accessories/${src}" />
        </a>`;
      });
      div.unshift(`<div class="accessories-images">`);
      div.push("</div>");
      header.insertAdjacentHTML("afterend", div.join(""));
    });

  document.querySelector("section.accessories > div").onmouseover = (ev) => {
    if (ev.target.nodeName.toUpperCase() === "IMG") {
      const r = (-4 + Math.random() * 8) | 0;
      ev.target.style.transform = `rotateZ(${r}deg)`;
    }
  };
}
initAccessories();

async function initTestimonials() {
  const cardEls = document.querySelectorAll(".testimonials .card");
  let data = await fetch("../testimonials/data.json").then((r) => r.json());
  let times = (Math.random() * data.length) | 0;
  while (--times > 0) {
    data.unshift(data.pop());
  }
  data = data.slice(0, cardEls.length);
  data.forEach((q, i) => {
    const card = cardEls[i];
    card.querySelector("h3").textContent = `"${q.teaser}"`;
    card.querySelector("p").textContent = `"${q.quote}" ~${q.name}`;
    card.querySelector(
      ".visual"
    ).style.backgroundImage = `url("./testimonials/${q.avatar}")`;
  });
}
initTestimonials();
