Update and get driver:
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y dkms git build-essential libelf-dev linux-headers-$(uname -r)
git clone https://github.com/aircrack-ng/rtl8812au.git
```

Build and install the driver:

```bash
cd rtl8812au
sudo make dkms_install
```

Or

```bash
sudo make
sudo make install
```

Restart driver:

```bash
sudo modprobe 8812au
```

Or reboot:

```bash
sudo reboot
```