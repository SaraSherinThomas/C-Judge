#include<stdio.h>

int difference(int a,int b){
	if(a>b)
		return a-b;
	else
		return b-a;
}

int main(){
	int c;
	c = difference(10,20);
	printf("difference = %d\n",c);	
	return 0;
}