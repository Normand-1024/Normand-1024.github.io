# Normand-1024.github.io

Hello! This is my work-in-progress personal website built using Jekyll

How to run locally: `jerkyll serve -P 8080 --trace` on port 8080

## TO-DO List

- Integrate [Medium](https://medium.com/@Jason_Matthew/display-medium-articles-on-your-site-d772b3b05779) with this website, we have figured out how to get json file of all the medium posts. Maybe we need to eventually use those info to build something similar to the blog posts
- Integrate [Instagram](https://millarian.com/code/adding-an-instagram-feed-to-jekyll/) with this website (Currently the API is shut down), maybe we can change it into an art page?
- Redraw the icons
- Provide 404 images
- Build a reading blog (seperate from medium)
- Integrate with itch.io?

## Reminding myself

### Jekyll doc

[Jekyll documentation to structure website](https://jekyllrb.com/docs/pages/)

### Here's the structure of jekyll

```text
/Users/barryclark/Code/jekyll-now
├─ CNAME # Contains your custom domain name (optional)
├─ _config.yml # Jekyll's configuration flags
├─ _includes # Snippets of code that can be used throughout your templates
│  ├─ analytics.html
│  └─ disqus.html
├─ _layouts
│  ├─ default.html # The main template. Includes <head>, <navigation>, <footer>, etc
│  ├─ page.html # Static page layout
│  └─ post.html # Blog post layout
├─ _posts # All posts go in this directory!
│  └─ 2014-3-3-Hello-World.md
├─ _site # After Jekyll builds the website, it puts the static HTML output here. This is what's served!
│  ├─ CNAME
│  ├─ LICENSE
│  ├─ about.html
│  ├─ feed.xml
│  ├─ index.html
│  ├─ sitemap.xml
│  └─ style.css
├─ about.md # A static "About" page that I created.
├─ feed.xml # Powers the RSS feed
├─ images # All of my images are stored here.
│  ├── first-post.jpg
├─ index.html # Home page layout
├─ scss # The Sass style sheets for my website
│  ├─ _highlights.scss
│  ├─ _reset.scss
│  ├─ _variables.scss
│  └─ style.scss
└── sitemap.xml # Site map for the website
```

### Liquid Templating

Double curly braces like `{{ content }}` are variables, this [site](https://jekyllrb.com/docs/variables/) provides all available variables.

In `_config.yml`:

```yml
footer-linkes:
    github: blah blah
```

can be used in `/_layouts/default.html`:

```html
<footer class="footer">
  {% if site.footer-links.github %}<a href="http://github.com/{{ site.footer-links.github }}">{% include svg-icons/github.html %}</a>{% endif %}
</footer>
```

### Images

We can use the local path to reference images:

```markdown
![Image description](/images/my-image.jpg)
```
