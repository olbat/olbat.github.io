---
layout: single
title: Identities
permalink: "ids/"
---
{% if site.data.identities.signature_file %}
{% assign links = site.data.identities.signature_file | relative_url | prepend: "Signed data|" | split: "," %}
{% include top-links.html icon="key" links=links %}
{% endif %}


## Profiles
{% if site.data.identities.profiles %}
{% assign profile_groups = site.data.identities.profiles | group_by: "type" %}
{% for profile_group in profile_groups -%}
<div markdown="1" class="page_ids__profile_group_block">
### {{profile_group.name | replace: "_", " " | capitalize}}
{% for profile in profile_group.items -%}
- [{% if profile.name -%}
    {{profile.name}}
  {%- else -%}
    {{profile.id | replace: "_", " " | capitalize}}
  {%- endif %}]({{profile.url}})
{% endfor -%}
{: class="page_ids__profile_group_block_{{ profile_group.items | size | divided_by: 6.0 | ceil  }}columns" }
</div>
{% endfor %}
<div class="cf" />
{% endif %}


{% if site.data.identities.messaging %}
## Messaging
{% for msg in site.data.identities.messaging -%}
- {% if msg.name -%}
    {{msg.name}}
  {%- else -%}
    {{msg.id | replace: "_", " " | capitalize}}
  {%- endif %}:
  {%- comment %} replace @ by an icon to avoid spam {% endcomment %}
  <code>{{msg.address | replace: "@", '<i class="fa fa-fw fa-at"></i>' }}</code>
{% endfor %}
{% endif %}


{% if site.data.identities.websites %}
## Websites
{% for website in site.data.identities.websites -%}
- {{website.name}}: [{{website.url}}]({{website.url}})
{% endfor %}
{% endif %}


{% if site.data.identities.misc %}
## Misc
{% for link in site.data.identities.misc -%}
- {% if link.name -%}
    {{link.name}}
  {%- else -%}
    {{link.id | replace: "_", " " | capitalize}}
  {%- endif %}: `{{link.value}}`
{% endfor %}
{% endif %}


{% if site.data.identities.pgp or site.data.identities.ssh %}
## Public keys
{% if site.data.identities.pgp %}
<details>
  <summary>PGP{% if site.data.identities.pgp.fingerprint %} <a href="https://keys.openpgp.org/vks/v1/by-fingerprint/{{site.data.identities.pgp.fingerprint | replace: ' ', ''}}</a>{% endif %} – <a href="{{site.data.identities.pgp.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.pgp.key}}</pre>
</details>
{% endif %}
{% if site.data.identities.ssh %}
<details>
  <summary>SSH – <a href="{{site.data.identities.ssh.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.ssh.key}}</pre>
</details>
{% endif %}
{% endif %}
