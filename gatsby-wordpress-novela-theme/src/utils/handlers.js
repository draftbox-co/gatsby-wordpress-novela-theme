var toHtml = require("hast-util-to-html");
var visit = require("unist-util-visit");
const list = require("hast-util-to-mdast/lib/handlers/list");

// other imported utils can be used for other custom elements like gallery

function iframe(h, node) {
  return h(node, "html", toHtml(node, { space: "html" }));
}

function figcaption(h, node) {
  return h(node, "html", toHtml(node, { space: "html" }));
}

function video(h, node) {
  return h(node, "html", toHtml(node, { space: "html" }));
}

function audio(h, node) {
  return h(node, "html", toHtml(node, { space: "html" }));
}

function ul(h, node) {
  if (
    node.properties &&
    node.properties.className &&
    node.properties.className.includes("blocks-gallery-grid")
  ) {
    let image = "";

    visit(node, function(node) {
      if (node.tagName === "img") {
        image +=
          "<p>" +
          h(node, "html", toHtml(node, { closeSelfClosing: true })).value +
          "</p>";
      }
    });

    return {
      type: "html",
      value: `${image}`,
    };
  } else {
    return list(h, node);
  }
}

function figure(h, node) {
  let hasImageGallery = false;
  let imageGallery = "";
  visit(node, function(node) {
    if (node.tagName && node.tagName === "svg") {
      delete node.properties["xmlnsXLink"];
    }
    if (
      node.properties &&
      node.properties.className &&
      node.properties.className.includes("blocks-gallery-grid")
    ) {
      hasImageGallery = true;
      visit(node, function(node) {
        if (node.tagName === "img") {
          imageGallery +=
            `<p>` +
            h(node, "html", toHtml(node, { closeSelfClosing: true })).value +
            "</p>";
        }
      });
    }

    if (node.tagName === "figcaption") {
      imageGallery += h(node, "html", toHtml(node, { closeSelfClosing: true }))
        .value;
    }
  });

  if (hasImageGallery) {
    return {
      type: "html",
      value: `${imageGallery}`,
    };
  } else {
    return h(
      node,
      "html",
      toHtml(node, {
        space: "html",
        closeSelfClosing: true,
        allowDangerousHtml: true,
      })
    );
  }
}
module.exports = { iframe, figcaption, ul, video, audio, figure };
