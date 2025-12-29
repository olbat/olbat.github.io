---
layout: single
title: Résumé
permalink: "cv/"
data_file: data/resume.json
sitemap: false
---
{% if site.data.resume %}
{% assign links = "files/misc/resume.json" | relative_url | prepend: "JSON Resume|" | split: "," %}
{% include top-links.html icon="file-alt" links=links %}
{% endif %}

<object
  data="/files/misc/cv-sarzyniec.pdf#toolbar=0"
  type="application/pdf"
  width="100%"
  height="2048"
  title="Résumé"
>
<figure markdown="1">
[![Résumé](/assets/images/cv-sarzyniec.jpg "CV"){: .align-center}](/files/misc/cv-sarzyniec.pdf)
</figure>
</object>
