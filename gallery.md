---
layout: page
title: Галерея
---

<div class="gallery">
  {% for painting in site.paintings %}
    <a href="{{ painting.url }}">
      <img src="{{ painting.image }}" alt="{{ painting.title }}">
    </a>
  {% endfor %}
</div>
