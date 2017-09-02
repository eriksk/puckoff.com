---
layout: page
title: Blog
permalink: /Blog/
---

<ul class="list-unstyled">
  {% for post in site.posts %}
    <li>
      <h4>
        <a href="{{ post.url }}">{{ post.title }}</a><small>{{ post.date }}</small>
      </h4>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>