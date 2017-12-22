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
<div markdown="1" style="float: left; margin-right: 1.5em;">
### {{profile_group.name | replace: "_", " " | capitalize}}
{% for profile in profile_group.items -%}
- [{% if profile.name -%}
    {{profile.name}}
  {%- else -%}
    {{profile.id | replace: "_", " " | capitalize}}
  {%- endif %}]({{profile.url}})
{% endfor -%}
{: style="column-count: {{profile_group.items | size | divided_by: 6.0 | ceil}}; margin-top: 0.2em; column-gap: 2em;" }
</div>
{% endfor %}
<div style="clear: both;" />
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
  <summary>PGP{% if site.data.identities.pgp.fingerprint %} <a href="http://p80.pool.sks-keyservers.net/pks/lookup?search=0x{{site.data.identities.pgp.fingerprint | replace: ' ', ''}}&op=vindex">{{site.data.identities.pgp.fingerprint}}</a>{% endif %} – <a href="{{site.data.identities.pgp.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.pgp.key}}</pre>
</details>
{% endif %}
{% if site.data.identities.ssh %}
<details>
  <summary>SSH – <a href="{{site.data.identities.pgp.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.ssh.key}}</pre>
</details>
{% endif %}
{% endif %}
