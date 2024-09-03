Put wireless card into monitor mode:

```bash
root@WiFiChallengeLab:~/wpa# airmon-ng start wlan0

Found 5 processes that could cause trouble.
Kill them using 'airmon-ng check kill' before putting
the card in monitor mode, they will interfere by changing channels
and sometimes putting the interface back in managed mode

    PID Name
    541 avahi-daemon
    546 NetworkManager
    570 wpa_supplicant
    575 avahi-daemon
    818 ifplugd

PHY	Interface	Driver		Chipset

phy0	wlan0		mac80211_hwsim	Software simulator of 802.11 radio(s) for mac80211

		(mac80211 monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)
		(mac80211 station mode vif disabled for [phy0]wlan0
```

Scan for target WPA2 network:

```bash
root@WiFiChallengeLab:~/wpa# airodump-ng wlan0mon --band abg
BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 F0:9F:C2:71:22:10  -28        2        0    0   6   54   OPN              wifi-guest                                                                                                                                                        
 EA:2A:C3:20:36:4B  -28        2        0    0   6   54   WPA2 CCMP   PSK  MiFibra-5-D6G3                                                                                                                                                    
 82:EE:66:FB:FA:B7  -28        2        0    0   6   54        CCMP   PSK  WIFI-JUAN                                                                                                                                                         
 F0:9F:C2:71:22:12  -28        2        0    0   6   54        CCMP   PSK  wifi-mobile                                                                                                                                                       
 F0:9F:C2:6A:88:26  -28        3        0    0  11   54   OPN              <length:  9>                                                                                                                                                      
 F0:9F:C2:1A:CA:25  -28        3        0    0  11   54e  WPA3 CCMP   SAE  wifi-IT                                                                                                                                                           
 F0:9F:C2:11:0A:24  -28        3        0    0  11   54e  WPA3 CCMP   SAE  wifi-management                                                                                                                                                   
 96:8E:24:05:65:FE  -28        3        0    0   9   54        TKIP   PSK  vodafone7123                                                                                                                                                      
 F0:9F:C2:71:22:15  -28        7        0    0  44   54e  WPA2 CCMP   MGT  wifi-corp                                                                                                                                                         
 F0:9F:C2:7A:33:28  -28        7        0    0  44   54e  WPA2 CCMP   MGT  wifi-regional-tablets                                                                                                                                             
 CA:5C:D0:39:C8:BD  -28       74        0    0   3   54        CCMP   PSK  MOVISTAR_JYG2                                                                                                                                                     
 F0:9F:C2:71:22:17  -28        8       38   13  44   54e  WPA2 CCMP   MGT  wifi-global                                                                                                                                                       
 F0:9F:C2:71:22:16  -28        8        0    0  44   54e  WPA2 CCMP   MGT  wifi-regional                                                                                                                                                     
 F0:9F:C2:71:22:1A  -28        8        0    0  44   54e  WPA2 CCMP   MGT  wifi-corp                                                                                                                                                         
 F0:9F:C2:71:22:11  -28       75     2226  282   3   54   WEP  WEP         wifi-old

```

Once target is found, scan only that device and save the output

```bash
```


```bash
```


```bash
```


```bash
```


```bash
```


```bash
```


```bash
```


```bash
```

```bash
```
