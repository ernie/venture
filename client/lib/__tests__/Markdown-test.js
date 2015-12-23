import { assert } from 'chai';

import Markdown from '../Markdown';

describe('Markdown', () => {

  describe('link', () => {

    it('sets the target to _blank', () => {
      let result = Markdown.render('[text](https://url.devel "title")').trim();
      assert.equal(
        result,
        '<p><a target="_blank" href="https://url.devel" title="title">text</a></p>'
      );
    });

  });

  describe('image', () => {

    it('uses the alt text as image dimensions', () => {
      let result = Markdown.render('![5x5](/images/some-image.png)').trim();
      assert.include(
        result,
        'style="width: 5em; height: 5em"'
      );
    });

    it('renders the image as a figure/figcaption when title supplied', () => {
      let result = Markdown.render('![5x5](/images/some-image.png "title")')
                           .trim();
      assert.include(
        result,
        '<figure style="width: 5em">'
      );
      assert.include(
        result,
        "<figcaption><p>title</p>\n</figcaption>"
      );
    });

    it('allows markdown in figcaptions', () => {
      let result = Markdown.render('![5x5](/images/some-image.png "*title*")')
                           .trim();
      assert.include(
        result,
        "<figcaption><p><em>title</em></p>\n</figcaption>"
      );
    });

  });

  describe('code', () => {

    it('syntax highlights code', () => {
      let result = Markdown.render(
        "```ruby\ndef hello\n  puts 'hello'\nend\n```"
      ).trim();
      assert.include(
        result,
        'class="lang-ruby"'
      );
      assert.include(
        result,
        '<span class="hljs-string">\'hello\'</span>'
      );
    });

    it('allows appending font-size to code hint', () => {
      let result = Markdown.render(
        "```ruby:42%\ndef hello\n  puts 'hello'\nend\n```"
      ).trim();
      assert.include(
        result,
        '<code style="font-size: 42%" class="lang-ruby">'
      );
    });

  });

});
