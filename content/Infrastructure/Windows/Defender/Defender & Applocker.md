#### Turn off Windows Defender (need to be admin)

```bash
Set-MpPreference -DisableRealtimeMonitoring $true
```
#### Check Defender Status

```bash
Get-MpComputerStatus
```
#### List AppLocker Rules

```bash
Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections
```
#### Test AppLocker Policy

```bash
Get-AppLockerPolicy -Local | Test-AppLockerPolicy -path C:\Windows\System32\cmd.exe -User Everyone
```

