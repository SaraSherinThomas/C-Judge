#include "quicksort.h"
int main(){
  int x[20],size,i;

size = 5;

  for(i=0;i<size;i++)
    scanf("%d",&x[i]);

  quicksort(x,0,size-1);


  for(i=0;i<size;i++)
    printf("%d ",x[i]);

  return 0;
}
