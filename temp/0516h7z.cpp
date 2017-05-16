#include <stdio.h>
#include<string.h>
#include <conio.h>
int main() {
	char a[9];
       int len = 9;
int i,flag=0;

      for (i=0;i<len;i++) {
scanf("%c",a[i]);
}
 	for (i=0;i<len;i++) {
		if(a[i]==a[len-i-1])
		     flag=flag+1;
	}
	if(flag==len)
	             printf("\nTHE STRING IS PALINDROM"); 
        else
	             printf("\nTHE STRING IS NOT PALINDROM");
//	getch();
return 0;
}