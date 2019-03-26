/**
*
* @author J. Bradley Briggs
*/
module.exports = class CharStream
{
    constructor(string)
    {
        this.stash = string ;
        this.pointer = 0 ; // next char to be read
    }

    advance()
    {
        if (!this.endOfStream()) this.pointer ++ ;
    }

    write(chars)
    {
        if (chars)
        {
            this.stash += chars ;
        }
    }

    read(numOfChars)
    {
        if (numOfChars)
        {
            var left = this.remainingChars() ;
            if (left < numOfChars) numOfChars = left ;

            var out =  this.stash.substr(this.pointer, numOfChars) ;
            this.pointer += numOfChars ;
            return out ;
        }
    }

    readUntil(someChar, trim=false)
    {
        if (someChar)
        {
            var stashedChar = "" ;
            var out = "" ;
            while (!this.endOfStream() && stashedChar != someChar)
            {
                stashedChar = this.read(1) ;
                if (stashedChar != someChar) out += stashedChar ;
            }
            if (trim) return out.trim() ;
            else return out ;
        }
    }

    readUntilBalanced(balancer, unbalancer, trim=false)
    {
        /*    
            ...xxxxxxxx[xxxxxx[xxx]xx[xx]x]xxxx...
                       ^                  ^ 
        */
       if (balancer && unbalancer)
       {
           var balance = 1 ; // assume the balancer has been read
           var out = "" ;
           var stashedChar = "" ;
           while (!this.endOfStream() && balance != 0)
           {
                stashedChar = this.read(1) ;
                out += stashedChar ;
                if (stashedChar == balancer) balance++ ;
                else if (stashedChar == unbalancer) balance-- ;
           }
           if (trim) return out.trim() ;
           else return out ;
       }
    }

    remainingChars()
    {
        return this.stash.length-1-this.pointer ;
    }

    endOfStream()
    {
        return this.pointer == this.stash.length-1;
    }
}
/*
var cs = new CharStream("hello: [there; [general;] kenobi.]") ;
console.log(cs.readUntil("[")) ;
console.log(cs.readUntilBalanced("[", "]", true)) ;
console.log(cs.read(100)) ;*/
/*
var json = "{\"key1\": 1123, \"key2\": \"3345ssddd\", \"key3\": {\"array\": [4, 5, 6, 7, 8, 9]}}" ;
var cs = new CharStream(json) ;
var obj ;
var key = "" ;
var value = {} ;
var readKey = false ;
for (var i=0; i<json.length; i++)
{
    var char = cs.read(1) ;
    if (char == "{")
    {
        if (!readKey) //outer-most object
        {   
            obj = {} ;
        }
        else 
        {
            obj[key] = {} ;
        }
    }
    else if (char == "\"")
    {

    }
    else if (char == ":")
    {

    }
    else if (char == ",")
    {

    }
}*/