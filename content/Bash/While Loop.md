
```bash
#!/bin/bash  
count=1  
while [ $count -le 5 ] 
do    
	echo "Count is: $count"     
	((count++)) 
done
```

One liner:
```bash
count=1; while [ $count -le 5 ]; do echo "Count is: $count"; ((count++)); done
```

