- Enable RDP

```bash
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 0
```

- Enable RDP through the firewall

```bash
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

- Verify

```bash
Get-NetTCPConnection -LocalPort 3389
```