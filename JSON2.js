class JSON2
{
    constructor(input, evalScripts=false)
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
             "SCRIPT": "~",
             "COMMENT": "#"};
        this.evalScripts = evalScripts;
        this.obj = this.parse()[0] ;
    }

    parse()
    {
        var key = "" ;
        var value = {};
        var first = true ;
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
                this.cs.advanceIgnoreWhiteSpace() ; //move past this brace
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
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advanceIgnoreWhiteSpace() ;
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
                this.cs.advanceIgnoreWhiteSpace() ; //move past this brace
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
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advanceIgnoreWhiteSpace() ;
                return value ;
            }
            else if (next == this.alphabet["KEY_VALUE_SEPERATOR"])
            {
                key = this.cs.readUntil(":", true) ;
            }
            else if (next ==this.alphabet["SCRIPT"])
            {
                key = this.cs.readUntil("~", true) ;
                var localAutoKey = 0 ;
                if (key == "")
                {
                    key = localAutoKey ;
                    localAutoKey+=1 ;
                }
                if (this.evalScripts)
                {
                    value[key] = {} ;
                    function insert(avalue)
                    {
                        value[key] = avalue;
                    }
                    function insertKeyValue(akey, avalue)
                    {
                        
                        if (akey == "")
                        {
                            akey = localAutoKey ;
                            localAutoKey+=1 ;
                        }
                        value[key][akey] = avalue;
                    }

                    var script = this.cs.readUntil("~", false) ;
                    eval(script) ;
                }
                else
                {
                    var script = this.cs.readUntil("~", false) ;
                    value[key] = script ;
                }
                if (this.cs.lookAhead(this.alphabet) == ",") this.cs.advanceIgnoreWhiteSpace() ;
            }
            else if (next == this.alphabet["COMMENT"])
            {
                this.cs.readUntil("#") ; // read until the opening comment 
                this.cs.readUntil("#") ; // 
            }
        }
        return value ;
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

    advance(numOfChars=1)
    {
        if (!this.endOfStream()) this.pointer+=numOfChars ;
    }

    advanceIgnoreWhiteSpace(numOfChars=1)
    {
        var count = 0 ;
        while (!this.endOfStream() && count < numOfChars)
        {
            if (this.stash.charAt(this.pointer) != " ") count++ ;
            this.advance() ;
        }
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
        var prevChar = "" ;
        while (!this.endOfStream())
        {
            var char = this.read() ;
            for (var key in someChars)
            {
                if (someChars[key] == char && prevChar != '\u005c')
                {
                    this.pointer = tempPointer ;
                    return someChars[key] ;
                }
            }
            var prevChar = char ;
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

//var j = "{name: JSON 2.0 Example, scripted section: {amounts~var obj=[123, 133, 1443, 112, 114]; for (var i=0; i<5; i++) insert(obj[i]);~, size~insert(Object.keys(value).length,key)~}, An array: [4, 5, 6, 7, 8]}" ;
//var j = "{ \"bob's array\": [1, 2, 3, 4], lamp #IGNORE THIS#light: \"7889 cents /*or anything really*/\", costs: {today: [1, 2, 3], yesterday: [4, 5, 6], script generated~var x=0; for(var i=0; i<20; i++)x+=i; console.log(x); var obj = {\"some key\": \"some value\"}; insert(obj);~}}" ;
//var j = "{fruits: [apples, pears, oranges], vegetables:[carrots, spinach, potato], stats:      {types: 2, total: 6}}" ;
//var j = "{name: name here, \nsurname: surname here, script generated~for(var x=0; x<50; x+=0.5) insert(x);~, comments: are they possible?}" ;
//var j2 = new JSON2(j) ;
var json2 = new JSON2("{title: an example, #HELLO THERE#   OS Info~var os=require('os'); insertKeyValue('platform', os.platform()); insertKeyValue('release',os.release());~}", true) ;
console.log(json2.toString()) ;
