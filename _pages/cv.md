---
layout: single
title: Résumé
permalink: "cv/"
data_file: data/resume.json
sitemap: false
noindex: true
---
{% if site.data.resume %}
{% assign links = "files/misc/resume.json" | relative_url | prepend: "JSON Resume|" | split: "," %}
{% include top-links.html icon="file-lines" links=links %}
{% endif %}

<object
  class="page_cv__cv_viewer"
  data="/files/misc/cv-sarzyniec.pdf#toolbar=0"
  type="application/pdf"
  title="Résumé"
>
<figure markdown="1">
[![Résumé](/assets/images/cv-sarzyniec.jpg "CV"){: .align-center}](/files/misc/cv-sarzyniec.pdf)
</figure>
</object>
