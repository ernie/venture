---
type: title
notes: |
  Hey! Thanks for checking out Venture. I had a lot of fun building it, and I
  hope you enjoy using it! This presentation will teach you enough to get
  started building your own interactive presentations.

  You can click the buttons up above these notes to advance or reverse through
  the presentation, or you can use right and left arrow keys, or a typical
  "clicker" that sends page up and page down.
---

# **Venture**

* [![1](images/twitter.png) erniemiller](https://twitter.com/erniemiller)
* Ernie Miller
* [&#128279; ernie.io](https://ernie.io)

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  A Venture presentation is made up of files called `stories`. You can find the
  story files that make up this presentation in `priv/stories`. The entry point
  for the presentation is the file named `main.story`.
---

## Presentations are stories.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  Stories consist of slides, like any presentation. Slides are just a special
  kind of markdown file. Each slide is separated by at least 6 backslashes. I
  like to use 80, because I'm an 80-column kind of guy. But you only need 6.

  Each slide can have metadata attached to it with its own YAML frontmatter
  section. This can tell Venture what kind of slide it is, add presenter notes,
  and more. If you don't specify any type, it's just a plain markdown slide.
---

<label>main.story</label>

```text:75%
---
type: title
notes: |
  Here are some presenter notes.
  This is just YAML frontmatter.
---

# My Presentation!

* Jane Doe
* janedoe@example.com
* JaneCo, Inc.

​\\\\\\

This is the second slide.
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
class: shadow
notes: |
  Since we're rendering in a browser, we can customize our slides with CSS. A
  few frequently-used styles are defined as classes in the scss file for
  `SlideContainer`. Look for `_SlideContainer.scss` to view it.

  If you supply a class name via `class` in the YAML frontmatter, it will
  change the display of your slides appropriately. This is the `shadow` class.

  It adds a shadow to any header elements on the slide. Regular body text is not
  affected.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
class: dark
notes: This is the `dark` class, which inverts the slide to white-on-black.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
class: font-75
notes: |
  This is the `font-75` class. It shrinks everything to 75% of its normal size.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
class: font-50
notes: |
  This is the `font-50` class. It shrinks everything to 50% of its normal size.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
class: [font-50, shadow]
notes: |
  You can also combine classes. Here's `[font-50, shadow]`.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


---
background: "#aaf"
notes: |
  Of course, there are some styles that are slide-specific. A background color,
  for instance.
---

```yaml
background: "#aaf"
background:
  color: "#aaf"
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background: poinsettia.jpg
notes: |
  Or a background image. Here's a lovely photo I took in Nairobi, Kenya, of a
  poinsettia tree.

  If you supply a string to the `background` property of the slide, it'll load a
  corresponding file in the `client/app/assets/backgrounds` directory.

  By default, backgrounds use `contain`. This means they will resize as large
  as possible while still allowing their dimensions to fit within the slide.
---

```yaml
background: poinsettia.jpg
background:
  image: poinsettia.jpg
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia.jpg
  darken: 0.5
notes: |
  You can also modify the image, if you wish, with filters. Here's a a 50%
  `darken` filter.
---

```yaml
background:
  image: poinsettia.jpg
  darken: 0.5
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia.jpg
  lighten: 0.5
notes: Here's a a 50% `lighten` filter.
---

```yaml
background:
  image: poinsettia.jpg
  lighten: 0.5
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
notes: |
  Now, let's look at what happens with an image that doesn't fill the slide.

  `contain` will size this square image to fill the full height of the slide.
---

```yaml
background:
  image: poinsettia-square.jpg
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
  size: 8em
notes: |
  We can adjust the size if we like. If we do this, we should use % or em units,
  because pixel sizes won't scale properly. In general, it's best to use em
  units.
---

```yaml
background:
  image: poinsettia-square.jpg
  size: 8em
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
  size: 8em 12em
notes: Or, we can supply width and height separately, to stretch the image.
---

```yaml
background:
  image: poinsettia-square.jpg
  size: 8em 12em
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
  size: 4em
  repeat: repeat
notes: |
  The `repeat` property will tile the image according to the specified type:

  * repeat - tile the image vertically and horizontally
  * repeat-x - tile the image horizontally
  * repeat-y - tile the image vertically

  Yes, these are TOTALLY just translated to `background-repeat` values, in case
  you were wondering.
---

```yaml
background:
  image: poinsettia-square.jpg
  size: 4em
  repeat: repeat
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
  size: 4em
  position: top right
notes: |
  You can also position the background, using stuff like `left`, `right`, `top
  left`, or `bottom right`.
---

```yaml
background:
  image: poinsettia-square.jpg
  size: 4em
  position: top right
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia-square.jpg
  size: cover
notes: |
  Lastly, you can use the `cover` size to scale an image up so that it fills the
  whole slide, without leaving any background color showing around the edges.
---

```yaml
background:
  image: poinsettia-square.jpg
  size: cover
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
