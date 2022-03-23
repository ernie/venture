---
next: thank-you
notes: |
  Speaking of aspect ratio, while Venture defaults to presenting in 4:3 aspect
  ratio, you can toggle this setting in its CSS. Take a look at the relevant
  lines in `presentation/assets/css/config.css`:

  ```css
  @import "aspect-4-3.css";
  /* @import "aspect-16-9.css"; */
  ```

  As you might imagine, swapping the line that's commented out will adjust the
  presentation's aspect ratio. In fact, you can try it while reading this.

  Try changing the `config.css` file to swap to 16:9 and back. A few seconds after
  saving a change, you'll see the presentater and attendee views update to the
  new slide format. The text sizes all remain the same. The only difference is
  the aspect ratio of the slide.
---

# **Aspect Ratio**
(4:3 and 16:9 supported out of the box)
