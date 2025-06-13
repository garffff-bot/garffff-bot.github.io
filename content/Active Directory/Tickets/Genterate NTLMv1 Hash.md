
```bash
import hashlib
import binascii

def ntlmv1_hash(password: str) -> str:
    # Encode the password as UTF-16LE (little-endian UTF-16)
    password_utf16 = password.encode('utf-16le')
    
    # MD4 hash of the encoded password
    md4_hash = hashlib.new('md4', password_utf16).digest()

    # Return the hex representation of the hash
    return binascii.hexlify(md4_hash).decode().upper()

if __name__ == '__main__':
    import sys

    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <password>")
        sys.exit(1)

    password = sys.argv[1]
    nt_hash = ntlmv1_hash(password)
    print(f"NTLMv1 Hash (NT hash) for '{password}': {nt_hash}")
```

Usage:

```bash
python3 ntlmv1.py Password123

NTLMv1 Hash (NT hash) for 'Password123': 58A478135A93AC3BF058A5EA0E8FDB71
```