Download 

```bash
wget https://kali.download/kali/pool/main/u/unsafeopenssl/libunsafessl1.0.2_1.0.2u-0kali2_amd64.deb
wget https://http.kali.org/pool/main/h/hostapd-wpe/hostapd-wpe_2.10%2Bgit20220310-0kali3_amd64.deb
```

Install:

```bash
sudo dpkg -i libunsafessl1.0.2_1.0.2u-0kali2_amd64.deb
sudo dpkg -i hostapd-wpe_2.10+git20220310-0kali3_amd64.deb
```

Install Python2:

```bash
sudo apt install build-essential libssl-dev libbz2-dev libreadline-dev libsqlite3-dev zlib1g-dev libncurses5-dev libncursesw5-dev libffi-dev wget -y

cd /usr/src
sudo wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz
sudo tar xzf Python-2.7.18.tgz
cd Python-2.7.18
sudo make clean

sudo ./configure
sudo make -j$(nproc)
sudo make altinstall
```

Install pip2:

```bash
curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py

sudo python2 get-pip.py
sudo pip2 install jinja2
```

Clone apd_launchpad:

```bash
sudo git clone https://github.com/WJDigby/apd_launchpad.git
```

Launch:

```bash
cd apd_launchpad
sudo python2 apd_launchpad.py -t garffffEnterprises -s  'garffff - Enterprises' -i wlan1 -cn garffffnet
sudo cp /etc/hostapd-wpe/hostapd-wpe.eap_user .

sudo hostapd-wpe ./garffffEnterprises/garffffEnterprises.conf
```

