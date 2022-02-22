---
notes: |
  Sometimes you want to reuse parts of a presentation in a different order.
  This means you can't just lean on the `next` property to link them together.
  Includes solve this problem nicely.
---

# **Includes**

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

---
type: fork
paths:
  - chicken-egg
  - egg-chicken
notes: |
  Here, we have an age-old question. We know that no matter what came first,
  the other thing must come second. We can create two stories to house the two
  possible orders, without duplicating the slides we want to show in either
  case.

  Includes look a little like slide separators, except that after the
  backslashes, we add `include` followed by the filename. So,
  `chicken-egg.story` will contain:

  ```
  \\\\\\ include chicken
  \\\\\\ include egg
  ```
---

#### Which came first?
