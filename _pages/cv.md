---
layout: single
title: Résumé
permalink: "cv/"
data_file: data/resume.json
---
{% if site.data.resume %}
{% assign links = "files/resume.json" | relative_url | prepend: "JSON Resume|" | split: "," %}
{% include top-links.html icon="file-text-o" links=links %}
{% endif %}

<div markdown="1" style="float: left; margin-left: 10%;">
## English
<figure markdown="1">
[![English CV](/assets/images/cv-sarzyniec-en.jpg "English CV"){: class="third" }](/files/misc/cv-sarzyniec-en.pdf)
</figure>
</div>

<div markdown="1" style="float: left; margin-left: 12%;">
## French
<figure markdown="1">
[![French CV](/assets/images/cv-sarzyniec-fr.jpg "French CV"){: class="third" }](/files/misc/cv-sarzyniec-fr.pdf)
</figure>
(not up-to-date)
</div>

<div style="clear: both;" />
