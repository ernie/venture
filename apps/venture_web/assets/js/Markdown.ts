import { marked } from 'marked';
import highlight from 'highlight.js';

marked.setOptions({
  highlight: function(code, lang) {
    if (lang) {
      return highlight.highlightAuto(code, [lang]).value;
    } else {
      return highlight.highlightAuto(code).value;
    }
  }
});

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


class Renderer extends marked.Renderer {

  link(href, title, text) {
    return super.link(href, title, text).replace('<a ', '<a target="_blank" ');
  }

  image(href, title, dims) {
    let [w, h] = dims.split('x');
    if (!w || /^\s*$/.test(w)) { w = 'auto' } else { w = `${w}em` }
    if (!h || /^\s*$/.test(h)) { h = 'auto' } else { h = `${h}em` }
    href = href.startsWith("/") ? href : `assets/${href}`
    let img = `<img src="${href}" style="width: ${w}; height: ${h}"`;
    img += this.options.xhtml ? '/>' : '>';

    if (title) {
      return `<figure style="width: ${w}">${img}<figcaption>${Markdown.render(title)}</figcaption></figure>`;
    } else {
      return img;
    }
  }

  code(code, lang, escaped) {
    let size = '100%';
    if (lang && lang.includes(':')) {
      [lang, size] = lang.split(':');
    }
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    return `<pre style="font-size: ${size}"><code class="hljs `
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>\n';
  };

}

let renderer = new Renderer();

export default class Markdown {

  static render(content) {
    return marked(content, { renderer: renderer })
  }

}
