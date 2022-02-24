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

* [![1](twitter.png) erniemiller](https://twitter.com/erniemiller)
* Ernie Miller
* [&#128279; ernie.io](https://ernie.io)

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  A Venture presentation is made up of files called `stories`, and any
  accompanying assets. These files live in `/presentation`, and you can see the
  files used in this presentation there. When you're ready to make your own
  presentation, you'll replace the files here with your own!

  The entry point for the presentation is the file named `main.story`.
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

## My Presentation!

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
  few frequently-used styles are defined as classes in the CSS file for
  `SlideContainer`. Look for `SlideContainer.css` to view it.

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
class: font-50 shadow
notes: |
  You can also combine classes. Here's `font-50 shadow`.
---

# Behold the power of CSS.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


---
align: top right
notes: |
  Of course, there are some styles that are slide-specific. Text placement, for
  instance.

  You can specify an `align` property on slides to control placement of their
  text.

  This slide's YAML includes the following:

  ```yaml
  align: top right
  ```
---

# top right
is a good place for this text.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background: "#aaf"
notes: |
  Or a background color. Provide a hex color as a string or a `color` property.
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
  corresponding file from your `/presentations/assets` directory. Or, you can
  supply an `image` inside the `background` property, along with other values
  we'll discuss shortly.

  In either case, if you prefix the background image with a `/`, you can provide
  an absolute path.

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

---
background:
  image: poinsettia.jpg
class: dark
attribution: |
  * Poinsettia Tree, Nairobi, Kenya
  * Ernie Miller
  * [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
notes: |
  Of course, if you're using images from other sources, you'll want to attribute
  the source. The `attribution` property lets you do this. It's a markdown field
  that expects you to provide each line of attribution in a bulleted list.

  It goes to the bottom right by default.
---

```yaml:50%
attribution: |
  * Poinsettia Tree, Nairobi, Kenya
  * Ernie Miller
  * [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
background:
  image: poinsettia.jpg
class: dark
attribution:
  position: top left
  content: |
    * Poinsettia Tree, Nairobi, Kenya
    * Ernie Miller
    * [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
notes: |
  If you'd like to position the attribution elsewhere, just supply `position`
  and `content` properties under the `attribution` property, instead of a
  markdown string.

  `position` works about the same as the one for `background`.
---

```yaml:50%
attribution: |
  position: top left
  content: |
    * Poinsettia Tree, Nairobi, Kenya
    * Ernie Miller
    * [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  For the most part, markdown in Venture works like GitHub Flavored Markdown.
  There are a few quick things worth pointing out, however. Some of them are
  syntactical additions, and some are just things that behave slightly
  differently than you might otherwise expect.
---

# Venture Flavored Markdown

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  A label tag can be added to a slide. It will be absolutely positioned in the
  top left. Feel free to adjust its size with a header level.

  This is mostly just to add a bit of flavor text related to the contents of a
  slide, or some context about where we are in the presentation that doesn't
  stand out too much from the content. We'll use labels on our remaining
  markdown discussion slides.
---

### <label>*#protip*</label>

```markdown
### <label>*#protip*</label>
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  All links open in a new window/tab, so that clicking or tapping on one won't
  stop viewing the presentation.
---

### <label>Links</label>

[Venture on GitHub](https://github.com/ernie/venture)

```markdown:70%
[Venture on GitHub](https://github.com/ernie/venture)
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  \[Alt\] content for images is not used for an "alt" attribute. Instead, it
  allows you to specify image size (in em-units). Images are sized with
  `object-fit` contain, which means the image will scale as large as it can
  within its bounding box while still maintaining its aspect ratio.

  Specify a single number to set the image width, `WxH` to set both width and
  height, or `xH` to set only a height.

  Note how `2x1` is sized the same as `1`, because the image is square and can
  only scale as large as the smallest constraint.

  Unless your image name starts with `/`, it will be interpreted as relative to
  the `/presentation/assets` directory.
---

### <label>Images</label>

![1](rhindle.png)
![2x1](rhindle.png)
![2x2](rhindle.png)
![x3](rhindle.png)

```markdown:70%
![1](rhindle.png)
![2x1](rhindle.png)
![2x2](rhindle.png)
![x3](rhindle.png)
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  "Title" content for images sets the "title" attribute for images, but also
  renders them in a `<figure>` with a `<figcaption>` element that contains the
  image title. You can put markdown inside the title.
---

### <label>Images</label>

![6](rhindle.png "A **fearsome** red dragon.
Or maybe a duck.")

```markdown:70%
![6](rhindle.png "A **fearsome** red dragon.
Or maybe a duck.")
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  Venture performs syntax highlighting of code in fenced code blocks using
  [highlight.js](https://highlightjs.org). Its default theme is
  [Solarized](http://ethanschoonover.com/solarized), specifically the "light"
  variant. You can see this in
  `apps/venture_web/assets/css/solarized_light.css`, swap to the the dark
  version in `root.css`, or supply your own alternative.
---

### <label>Code</label>

```elixir
defmodule Venture.Presentation do
  use GenServer
  use Venture.Slide
  alias Venture.Deck

  @entry %{ story: "main", index: 0 }

  ## Client API
  # ...
end
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
notes: |
  Venture extends language hints by allowing a font size specification after the
  hint, separated by a colon. Here's the code from the previous slide, using
  `elixir:50%`.

  **Be sure to use % or em-units for font size specification!** The rule of
  thumb for Venture presentations is that **px are bad**!
---

### <label>Code</label>

```elixir:50%
defmodule Venture.Presentation do
  use GenServer
  use Venture.Slide
  alias Venture.Deck

  @entry %{ story: "main", index: 0 }

  ## Client API
  # ...
end
```

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
type: title
notes: |
  Near the beginning of this presentation, you saw a sample `main.story` file
  with two slides, including a title slide like this.

  These work more or less like a normal slide, except that they expect a
  bulleted list of items that will be placed along the bottom edge of the slide
  and spaced to fit.

  There's no magic going on here. The styling is just handled with CSS. You can
  see it in `TitleSlide.css`.
---

## My Presentation!

* Jane Doe
* janedoe@example.com
* JaneCo, Inc.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
type: poll
background:
  image: monty-python-bridgekeeper.jpg
  size: cover
  darken: 0.5
class: dark
options:
  - Red!
  - No, blue!
notes: |
  Now that we've gotten all of that boring formatting stuff out of the way, it's
  time for the fun stuff. This is a "poll" slide. Set the `type` property to
  "poll" and you can supply multiple options for attendees to vote on in the
  `options` property. This one was set up like this:

  ```yaml
  type: poll
  options:
    - Red!
    - No, blue!
  ```

  Go ahead and try it out! You can open multiple windows and point at your
  presentation. You'll notice that each "attendee" can vote, and can change
  their vote at any time. The currently winning vote will be highlighted green,
  and their current selection will glow red.
---

What is your favorite color?

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
type: fork
background: fork.jpg
class: dark shadow
paths:
  - left
  - right
notes: |
  The "fork" slide type is where the really interesting stuff happens. It's like
  a poll, except that each option refers to another slide in the presentation.

  Each path the presentation can take is listed in the `paths` property, like
  this:

  ```yaml
  type: fork
  paths:
    - left
    - right
  ```

  A "path" is in the format `<story>:<zero-based-slide-index>`. Normally, you'll
  just leave off the slide index and use the default of `0`, as seen here.

  The path is represented by a thumbnail view of the slide that will shown when
  clicked. On this slide, we used a trick of setting each slide's background to
  a cropped version of the main slide's image so they seem to be transparent.

  Note that the presenter overlay doesn't show a preview of the next slide,
  since we don't know what the next slide will be until we pick one.

  Click an option to proceed.
---

#### **Which way?**
