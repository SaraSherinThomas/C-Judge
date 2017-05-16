#include <iostream>
using namespace std;

class StackUnderFlowException 
{
    public:
        StackUnderFlowException() 
        {
            cout << "Stack underflow" << endl;
        }
};

struct Node 
{
    int data;
    Node* link;
};

class ListStack 
{
    private:                 
        Node* top;
        int count;
            
  public:        
      ListStack() 
      {            
          top = NULL;
          count = 0;        
    }        
    
    void Push(int element)
    { 
        Node* temp = new Node();
        temp->data = element;
        temp->link = top;
        top = temp;     
        count++;          
    }        
            
    int Pop()
    {            
        if ( top == NULL ) 
            {            
                throw new StackUnderFlowException();            
            }        
            int ret = top->data;    
            Node* temp = top->link;
            delete top;
            top = temp;
            count--;
            return ret;        
    }        
    
    int Top() 
    {            
        return top->data;        
    }
    
    int Size() 
    {
        return count;
    }
    
    bool isEmpty() 
    {
        return ( top == NULL ) ? true : false;
    }
};

int main()
{    
    ListStack s; 
    try {
        if ( s.isEmpty() ) 
            {
            cout << "Stack is empty" << endl;    
            }
        // Push elements    
        s.Push(100);    
        s.Push(200);    
        // Size of stack
        cout << "Size of stack = " << s.Size() << endl;
        // Top element    
        cout << s.Top() << endl;    
        // Pop element    
        cout << s.Pop() << endl;
      // Pop element    
        cout << s.Pop() << endl;
      // Pop element    
        cout << s.Pop() << endl;
    }
    catch (...) {
        cout << "Some exception occured" << endl;
    }
}
