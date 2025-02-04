### View Shares

```bash
smbmap -H <ip>
smbmap -H <ip> -r <folder>
smbmap -H <ip> --download "<folder>\<file>"
smbmap -H <ip> -u <user> -p '<LM_hash>:<NTLMv2_hash>' -d domain 
smbmap -H <ip> -u <user> -p '<password>' -d domain

nxc smb <ip> -i <user> -P/-H <password><HTLMv2_hash> --shares

smbclient -N -L //<IP>
```

```bash
enum4linux-ng.py <IP> -A -C
```
### Access Shares

```bash
smbclient //<ip>/<share_name> -U '<domain>\<username>%<password>'
smbclient //<ip>/<share_name> -U '<domain>\<username>' --pw-nt-hash <NTLMv2_hash>
```
### RPC

Anonymous Login:

```
rpcclient -U'%' 10.10.110.17
enumdomusers
```
### Mount

Linux:

```bash
sudo apt install cifs-utils
sudo mkdir /mount/point
sudo mount -t cifs //<ip>/<share_name> /mount/point
```

```bash
sudo mount -t cifs //<ip>/<share_name> /mount/point -o guest
```

```bash
sudo mount -t cifs -o username=<username>,password=<password>,domain=. //<ip>/<share_name> /mount/point
```

```bash
sudo mount -t cifs //server_ip/<share_name> /mount/point -o credentials=/home/username/.smbcredentials
```

`.smbcredentials` file:

```bash
nano /home/username/.smbcredentials

username=user 
password=pass
domain=.

chmod 600 /home/username/.smbcredentials`
```

Windows - CMD

```bash
dir \\<ip>\<share_name>\
net use n: \\<ip>\<share_name>
net use n: \\<ip>\<share_name> /user:<username> <password>
```

Windows - PowerShell

```bash

Get-ChildItem \\<ip>\<share_name>\
New-PSDrive -Name "N" -Root "\\<ip>\<share_name>" -PSProvider "FileSystem"
```

Windows - PowerShell - With Username & Password

```bash
$username = '<username>'
$password = '<password>'
$secpassword = ConvertTo-SecureString $password -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential $username, $secpassword
New-PSDrive -Name "N" -Root "\\<ip>\<share_name>" -PSProvider "FileSystem" -Credential $
```
