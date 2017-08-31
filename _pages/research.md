---
layout: single
title: Research
permalink: "research/"
---

## Papers
{% for paper in site.data.research.papers %}
- __{{paper.title}}__ ([file]({{paper.file | relative_url}}){% if paper.url %}, [url]({{paper.url}}){% endif %}){% if paper.reference %}  
  {{paper.reference}}  {% endif %}{% if paper.target.description%}  
  {{paper.target.description}}  {% endif %}
  _{{paper.target.name}}{% if paper.target.location %}, {{paper.target.location}}{% endif %}{% if paper.target.url %} ([more]({{paper.target.url}})){% endif %}_
{% endfor %}

## Posters
{% for poster in site.data.research.posters %}
- __{{poster.title}}__ ([file]({{poster.file | relative_url}}){% if poster.url %}, [url]({{poster.url}}){% endif %}){% if poster.target.description %}  
  {{poster.target.description}}  {% endif %}
  _{{poster.target.name}}{% if poster.target.location %}, {{poster.target.location}}{% endif %}{% if poster.target.url %} ([more]({{poster.target.url}})){% endif %}_
{% endfor %}

## Slides
{% for slides in site.data.research.slides %}
- __{{slides.title}}__ ([file]({{slides.file | relative_url}}){% if slides.url %}, [url]({{slides.url}}){% endif %}){% if slides.target.description %}  
  {{slides.target.description}}  {% endif %}{% if slides.target %}
  _{{slides.target.name}}{% if slides.target.location %}, {{slides.target.location}}{% endif %}{% if slides.target.url %} ([more]({{slides.target.url}})){% endif %}_{% endif %}
{% endfor %}

## Projects
{% for project in site.data.research.projects -%}
- [{{project.name}}]({{project.url}}) ({{project.description}})
{% endfor %}

## Misc
{% for doc in site.data.research.misc %}
- __{{doc.title}}__ ([file]({{doc.file | relative_url}}){% if doc.url %}, [url]({{doc.url}}){% endif %}){% if doc.description %}  
  {{doc.description}}  {% endif %}{% if doc.target %}
  _{{doc.target.name}}{% if doc.target.location %}, {{doc.target.location}}{% endif %}{% if doc.target.url %} ([more]({{doc.target.url}})){% endif %}_{% endif %}
{% endfor %}


{% if site.data.research.profiles.google_scholar %}[Google scholar](http://scholar.google.com/citations?user={{site.data.research.profiles.google_scholar}}){% endif %}{% if site.data.research.profiles.research_gate %} \| [ResearchGate](https://www.researchgate.net/profile/{{site.data.research.profiles.research_gate}}){% endif %}
{: .text-right}
