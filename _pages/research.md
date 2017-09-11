---
layout: single
title: Research
permalink: "research/"
---
{% include structured_data/research.html research=site.data.research %}
{% assign profiles = site.data.identities.profiles | where: "type", "research" %}
{% if profiles %}
  {% capture links %}
  {%- for profile in profiles -%}
    {%- if profile.name -%}
{{profile.name}}
    {%- else -%}
{{profile.id | replace: "_", " " | capitalize}}
    {%- endif %}|{{profile.url}},
  {%- endfor -%}
  {% endcapture %}

  {% assign size = links | size | minus: 2 %}
  {% assign links = links | slice: 0, size | split: "," %}
  {% include top-links.html icon="university" links=links %}
{% endif %}

## Papers
{% for paper in site.data.research.papers %}
- {% include research-doc.html doc=paper %}
{% endfor %}


## Posters
{% for poster in site.data.research.posters %}
- {% include research-doc.html doc=poster %}
{% endfor %}


## Slides
{% for slides in site.data.research.slides %}
- {% include research-doc.html doc=slides %}
{% endfor %}


## Projects
{% for project in site.data.research.projects -%}
- [{{project.name}}]({{project.url}}) ({{project.description}})
{% endfor %}


## Misc
{% for doc in site.data.research.misc %}
- {% include research-doc.html doc=doc %}
{% endfor %}
