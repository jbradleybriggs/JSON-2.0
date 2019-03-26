
/**
*
* @author J. Bradley Briggs
*/
class JSON2
{
    constructor(input)
    {
        this.input = input ;
        this.pointer = -1 ;
        this.output = {} ;
        this.CharStream = require('./Charstream.js') ;
        this.chars = new this.CharStream(input) ;
    }

    parse()
    {
        var obj ;
        var key = "" ;
        var value = {} ;
        var readKey = false ;
        while (!this.chars.endOfStream())
        {
            var char = this.chars.read(1) ;
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
            else if (char == "\"") // either a string value or a key
            {
                value = this.chars.readUntil("\"") ;
                if (!readKey) 
                {
                    key = value ;
                    readKey = true ;
                }
                else 
                {

                }
            }
            else if (char == ":")
            {

            }
            else if (char == ",")
            {

            }
        }
        return obj ;
    }


}