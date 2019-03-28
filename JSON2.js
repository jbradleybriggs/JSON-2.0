class JSON2
{
    constructor(input)
    {
        this.input = input ;
        this.cs = new CharStream(input) ;
        this.alphabet = 
            {"KEY_VALUE_SEPERATOR": ":", 
             "VALUE_TERMINATOR": ",",
             "OBJECT_START": "{",
             "ARRAY_START": "[",
             "OBJECT_END": "}",
             "ARRAY_END": "]",
             "SCRIPT": "~"};
        this.obj = this.parse()[0] ;
    }

    parse()
    {
        var key = "" ;
        var value = {};
        var autoKey = 0 ;
        while (!this.cs.endOfStream())
        {
            var next = this.cs.lookAhead(this.alphabet) ;
            if (next == this.alphabet["OBJECT_START"])
            {
                if (key == "")
                {
                    key = autoKey ;
                    autoKey+=1 ;
                }
                this.cs.advance() ; //move past this brace
                value[key] = this.parse() ;
                key = "" ;
            }
            else if (next == this.alphabet["OBJECT_END"])
            {
                // check for any values before the end of the object:
                if (key == "")
                {
                    key = autoKey ;
                    autoKey+=1 ;
                }
                var last = this.cs.readUntil("}", true) ;
                if (last != "") value[key] = last ;
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advance() ;
                return value ;
            }
            else if (next == this.alphabet["VALUE_TERMINATOR"])
            {
                if (key == "")
                {
                    key = autoKey ;
                    autoKey+=1 ;
                }
                value[key] = this.cs.readUntil(",", true) ;
                key = "" ;
            }
            else if (next == this.alphabet["ARRAY_START"])
            {
                if (key == "")
                {
                    key = autoKey ;
                    autoKey+=1 ;
                }
                this.cs.advance() ; //move past this brace
                value[key] = this.parse() ;
                key = "" ;
            }
            else if (next == this.alphabet["ARRAY_END"])
            {
                // check for any values before the end of the object:
                if (key == "")
                {
                    key = autoKey ;
                    autoKey+=1 ;
                }
                var last = this.cs.readUntil("]", true) ;
                if (last != "") value[key] = last ;
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advance() ;
                return value ;
            }
            else if (next == this.alphabet["KEY_VALUE_SEPERATOR"])
            {
                key = this.cs.readUntil(":", true) ;
            }
            else if (next ==this.alphabet["SCRIPT"])
            {
                key = this.cs.readUntil("~", true) ;

                function insert(avalue, akey="")
                {
                    if (akey == "")
                    {
                        akey = autoKey ;
                        autoKey+=1 ;
                    }
                    value[akey] = avalue;
                }

                var script = this.cs.readUntil("~", false) ;
                eval(script) ;
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advance() ;
            }
            else if (next == this.alphabet["COMMENT"])
            {

            }
        }
        return value ;
    }

    unquote(string)
    {

    }

    tabString(tabs)
    {
        var result = "" ;
        for (var i=0; i<tabs; i++)
            result += "\t" ;
        return result ;
    }

    getString(obj, level)
    {
        var result = this.tabString(level) + "{\n" ;
        var count = 0 ;
        for (var key in obj)
        {
            var value = obj[key] ;
            if (typeof value == "object")
            {
                result += this.tabString(level+1) + key + ": " + "\n" + this.getString(value, level+1) ;
            }
            else result += this.tabString(level+1) + key + ": " + value ;
            if (count != Object.keys(obj).length-1) result+=",\n" ;
            else result+="\n" ;
            
            count++ ;
        }
        result += this.tabString(level) + "}" ;
        return result ;
    }

    toString()
    {
        return this.getString(this.obj, 0) ;
    }
}

class CharStream
{
    constructor(someString)
    {
        this.stash = someString ;
        this.pointer = 0 ; // next char to be read
    }

    advance()
    {
        if (!this.endOfStream()) this.pointer++ ;
    }

    endOfStream()
    {
        return this.pointer == this.stash.length ;
    }

    printCharsLeft()
    {
        console.log(this.stash.substr(this.pointer)) ;
    }

    read(numChars=1)
    {
        if (numChars)
        {
            var left = this.charsLeft() ;
            if (left < numChars) numChars = left ;

            var out =  this.stash.substr(this.pointer, numChars) ;
            this.pointer += numChars ;
            return out ;
        }
    }

    charsLeft()
    {
        return this.stash.length-this.pointer ;
    }

    /**
     * 
     * @param {Object} someChars 
     */
    lookAhead(someChars)
    {
        var tempPointer = this.pointer ;
        while (!this.endOfStream())
        {
            var char = this.read() ;
            for (var key in someChars)
            {
                if (someChars[key] == char)
                {
                    this.pointer = tempPointer ;
                    return someChars[key] ;
                }
            }
        }
        this.pointer = tempPointer ;
        return undefined ;
    }

    /**
     * Read until 'someChar' is encountered.
     * @param {char} someChar 
     * @param {boolean} trim trim whitespace or not
     */
    readUntil(someChar, trim=false)
    {
        if (someChar)
        {
            var stashedChar = "" ;
            var out = "" ;
            while (!this.endOfStream() && stashedChar != someChar)
            {
                stashedChar = this.read() ;
                if (stashedChar != someChar) out += stashedChar ;
            }
            if (trim) return out.trim() ;
            else return out ;
        }
    }

}

var j = "{amounts~var obj=[123, 133, 1443, 112, 114]; for (var i=0; i<5; i++) insert(obj[i], key+ \" \" + i);~, size: 5}" ;
//var j = "{ \"bob's array\": [1, 2, 3, 4], lamp #IGNORE THIS#light: \"7889 cents /*or anything really*/\", costs: {today: [1, 2, 3], yesterday: [4, 5, 6], script example~var x=0; for(var i=0; i<20; i++)x+=i; console.log(x); var obj = {\"key\": \"value\"}; ~} }" ;
var j2 = new JSON2(j) ;
console.log(j2.toString()) ;
