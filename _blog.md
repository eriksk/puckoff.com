---
layout: page
title: Blog
permalink: /Blog/
---

<ul class="list-unstyled">
  {% for post in site.posts %}
    <li>
      <h4>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <small>
            {% assign date_format = site.minima.date_format | default: "%b %-d, %Y" %}
            {{ post.date | date: date_format }}
        </small>
      </h4>
      <i>{{ post.excerpt }}</i>
    </li>
  {% endfor %}
</ul>