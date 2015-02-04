function StackOps()
{
        this.stack = new Array();
        this.ops = {
                1 : "Dup",
                2 : "Drop",
                3 : "Swap",
                4 : "Over",
                5 : "Rot",
                6 : "MinusRot",
                7 : "TwoDup",
                8 : "TwoDrop",
                9 : "TwoSwap",
                10 : "TwoOver",
        };
        this.ops_range = 10;
        
        this.pop = function() {
                return this.stack.pop();
        }
        
        this.push = function(item) {
                this.stack.push(item);
        }
        
        this.get = function(index) {
                return this.stack[index];
        }
        
        this.length = function() {
                return this.stack.length;
        }
        
        this.Init = function(arr) {
                for(i = 0; i<arr.length; i++) {
                        this.stack.push(arr[i]);
                }
        }
        
        this.PrintStack = function() {
                var cstr = "";
                for (i = 0; i < this.stack.length; i++) {
                        cstr = cstr + " " + this.stack[i];
                }
        
                alert("stack content: " + cstr);
        }
        
        this.Dup = function() {
                if(this.stack.length > 0) {
                        this.stack.push(this.stack[this.stack.length-1]);
                }
        }
        
        this.Drop = function(){
                if(this.stack.length > 0) {
                        this.stack.pop();
                }
        }
        
        this.Swap = function() {
                if(this.stack.length >= 2) {
                        var temp = this.stack[this.stack.length-1];
                        this.stack[this.stack.length - 1] = this.stack[this.stack.length - 2];
                        this.stack[this.stack.length - 2] = temp;
                }
        }
        
        this.Over = function() {
                if(this.stack.length >= 2) {
                        var temp = this.stack[this.stack.length-2];
                        this.stack.push(temp);
                }
        }
        
        this.Rot = function() {
                if(this.stack.length >= 3) {
                        var temp = this.stack[this.stack.length-3];
                        this.stack.splice((this.stack.length-3), 1);
                        this.stack.push(temp);
                }
        }
        
        this.MinusRot = function() {
                if(this.stack.length >= 3) {
                        var temp = this.stack[this.stack.length - 1];
                        this.stack[this.stack.length - 1] = this.stack[this.stack.length - 2];
                        this.stack[this.stack.length - 2] = this.stack[this.stack.length - 3];
                        this.stack[this.stack.length - 3] = temp;
                }
        }
        
        this.TwoDup = function() {
                if(this.stack.length >= 2) {
                        var first = this.stack[this.stack.length-2];
                        var sec = this.stack[this.stack.length-1];
                        this.stack.push(first);
                        this.stack.push(sec);
                }
        }
        
        this.TwoDrop = function(){
                if(this.stack.length >= 2) {
                        this.stack.pop();
                        this.stack.pop();
                }
        }
        
        this.TwoSwap = function() {
                if(this.stack.length >= 4) {
                        var first = this.stack[this.stack.length-1];
                        var sec = this.stack[this.stack.length-2];
                        this.stack[this.stack.length-1] = this.stack[this.stack.length-3];
                        this.stack[this.stack.length-2] = this.stack[this.stack.length-4];
                        this.stack[this.stack.length-3] = first;
                        this.stack[this.stack.length-4] = sec;
                }
        }
        
        this.TwoOver = function() {
                if(this.stack.length >= 4) {
                        var first = this.stack[this.stack.length-4];
                        var sec = this.stack[this.stack.length-3];
                        this.stack.push(first);
                        this.stack.push(sec);
                }
        }
        
        this.Addition = function() {
                if(this.stack.length >= 2) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(a+b);
                }
        }
        
        this.Substraction = function() {
                if(this.stack.length >= 2) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(a-b);
                }
        }
        
        this.Multiplication = function() {
                if(this.stack.length >= 2) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(a*b);
                }
        }
        
        this.Division = function() {
                if(this.stack.length >= 2) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(a/b);
                }
        }
        
        this.Modulo = function() {
                if(this.stack.length >= 2) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(a%b);
                }
        }
        
        this.Negate = function() {
                if(this.stack.length >= 1) {
                        var a = this.stack.pop();
                        this.stack.push(-a);
                }
        }
        
        this.Abs = function() {
                if(this.stack.length >= 1) {
                        var a = this.stack.pop();
                        this.stack.push(Math.abs(a));
                }
        }
        
        this.Min = function() {
                if(this.stack.length >= 1) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(Math.min(a, b));
                }
        }
        
        this.Max = function() {
                if(this.stack.length >= 1) {
                        var a = this.stack.pop();
                        var b = this.stack.pop();
                        this.stack.push(Math.max(a, b));
                }
        }
}


function Generator()
{
        this.initial = new Array();
        this.generated = new Array();
        this.internal_stack = new StackOps();

        //Helpers

        //Generators:
        //random generator
        this.GenType1 = function(nr_ops, ops_range) {
                this.generated.length = 0;
                for(i = 0; i<nr_ops; i++) {
                        this.generated.push(Math.floor((Math.random() * ops_range) + 1));
                }
        }

        //sligthly better generator
        this.GenType2 = function(nr_ops, ops_range) 
        {
                var work_arr = new Array();
                var prev_elem = "";
                var curr_elem = "";
                this.generated.length = 0;
                work_arr.length = 0;

                for(i = 0; i<nr_ops; i++) {
                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                        if (i >= 1) {
                                prev_elem = work_arr[i-1];
                                if(prev_elem == 3) {
                                        if(curr_elem == 3) {
                                                while(1) {
                                                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                                                        if(curr_elem != 3) {
                                                                break;
                                                        }
                                                }
                                        }
                                }
                                if(prev_elem == 5) {
                                        if(curr_elem == 6) {
                                                while(1) {
                                                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                                                        if(curr_elem != 6) {
                                                                break;
                                                        }
                                                }
                                        }
                                }
                                if(prev_elem == 6) {
                                        if(curr_elem == 5) {
                                                while(1) {
                                                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                                                        if(curr_elem != 5) {
                                                                break;
                                                        }
                                                }
                                        }
                                }
                                if(prev_elem == 9) {
                                        if(curr_elem == 9) {
                                                while(1) {
                                                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                                                        if(curr_elem != 9) {
                                                                break;
                                                        }
                                                }
                                        }
                                }
                        }
        
                        work_arr.push(curr_elem);
                }
        
                this.generated = work_arr;
        }

        //experimental
        this.GenType3 = function(nr_ops, ops_range) {
                this.GenType2(nr_ops, ops_range)

                for(j = 0; j<nr_ops; j++) {
                        var counter = 0;
                        
                        for(i = 0; i<nr_ops; i++) {
                                if(j == this.generated[i]) {
                                        counter++;
                                        if (counter > 2) {
                                                var curr_elem = 0;
                                                while(1) {
                                                        curr_elem = Math.floor((Math.random() * ops_range) + 1);
                                                        if(curr_elem != j) {
                                                                break;
                                                        }
                                                }
                                                this.generated[i] = curr_elem;                     
                                        }
                                }
                        }
                }
        }
        
        this.GenerateOps = function(nr_ops, ops_range, gentype) {
                if(gentype == 1) {
                this.GenType1(nr_ops, ops_range);
                }
                else if(gentype == 2) {
                        this.GenType2(nr_ops, ops_range);
                }
                else if(gentype == 3) {
                        this.GenType3(nr_ops, ops_range);
                }
        }

        this.ExecuteOps = function() {
                for(i = 0; i<this.generated.length; i++) {
                        var opname = this.internal_stack.ops[this.generated[i]];
                        this.internal_stack[opname]();
                }
        }

        this.StandardOperation = function(initialp, nr_ops) {
                this.internal_stack.Init(initialp);
                this.GenerateOps(nr_ops, this.internal_stack.ops_range, 3);
                this.ExecuteOps();
        }

        this.PrintResult = function() {
                var ops_list="";
                for(i = 0; i<this.generated.length; i++) {
                        ops_list = ops_list + " " + this.internal_stack.ops[this.generated[i]];
                }
                alert("ops executed: " + ops_list);
                this.internal_stack.PrintStack();
        }
    
        //Main interface
        this.GenerateRandom = function(initial_max_size, initial_max_rand, nr_ops) {
                this.initial.length = 0;
                for(i = 0; i<initial_max_size; i++) {
                        this.initial.push(Math.floor((Math.random() * initial_max_rand) + 1));      
                }

                this.StandardOperation(this.initial, nr_ops);               
        }

        this.GenerateFromArray = function(new_initial, nr_ops) {
                this.initial = new_initial;
                this.StandardOperation(this.initial, nr_ops);
        }
}

$(function() {
/*var test = new StackOps();
test.push(1);
test.push(2);
test.push(3);
test.Dup();
test.PrintStack();

alert("stack length= " + test.length());

test.PrintStack();
test.Swap();
test.PrintStack();
test.Over();
test.PrintStack();
test.Rot();
test.PrintStack();
test.TwoSwap();
test.Max();
test.PrintStack();

var go = new Generator();
go.GenerateRandom(3, 5, 2);
go.PrintResult();

//var ia = [1 , 2 , 3];
//go.GenerateFromArray(ia, 1);
//go.PrintResult();*/

});
